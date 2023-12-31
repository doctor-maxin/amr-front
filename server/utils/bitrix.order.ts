import {
	createBitrixContact,
	getBitrixContact,
} from "~/server/utils/bitrix.contacts";
import useBitrixClient from "~/server/utils/bitrix.client";
import { PaymentTypes } from "~/server/types/checkout.types";
import { DeliveryTypes } from "~/types/cart";

export default async function createBitrixOrder(
	payload: any,
	query: any,
	active: string
) {
	const bitrix = useBitrixClient();
	let contactId = await getBitrixContact(
		payload.phone.replace(/[^\w\s]/gi, ""),
		payload.email
	);
	console.log("get contact", contactId);

	if (!contactId) contactId = await createBitrixContact(payload);
	console.log("create contact", contactId);
	let address = `|Россия|||`;
	address += (payload.city ?? "") + "|";
	address += payload.street ?? "";
	address += payload.house ?? "";
	address += "|";
	address += payload.flat ?? "";
	address += payload.floor;

	console.log("CREATE DEAL PAYLOAD", payload.items);

	const { result: orderId } = await bitrix.deals.create({
		TYPE_ID: "SALE",
		TITLE: "Заказ №",
		IS_NEW: "Y",
		CLOSED: "N",
		CATEGORY_ID: "27",
		ASSIGNED_BY_ID: active.trim(),
		STAGE_ID: "C27:NEW",
		UTM_CONTENT: query?.utm_content?.toString() ?? "",
		UTM_MEDIUM: query?.utm_medium?.toString() ?? "",
		UTM_TERM: query?.utm_term?.toString() ?? "",
		UTM_SOURCE: query?.utm_source?.toString() ?? "",
		UTM_CAMPAIGN: query?.utm_campaign?.toString() ?? "",
		CONTACT_ID: contactId?.toString(),
		OPENED: "Y",
		UF_CRM_1695556357247: `|Россия|||${payload.city}|${payload.street}, ${payload.house}|${payload.flat}`,
		UF_CRM_1695564161556:
			payload.paymentType === PaymentTypes.TINKOFF
				? "Онлайн по карте"
				: payload.paymentType++ + PaymentTypes.SELF_CARD
					? "При получении картой"
					: "При получении наличными",
		UF_CRM_1695564173225:
			payload.deliveryType === DeliveryTypes.points
				? "Самовывоз"
				: "Доставка",
	});

	const result = await Promise.all([
		bitrix.deals.update(orderId, {
			TITLE: `Заказ №${orderId}`,
		}),
		bitrix.call("crm.deal.productrows.set", {
			id: orderId,
			rows: payload.items.map((item) => ({
				PRODUCT_NAME: item.name,
				PRICE: item.price,
				QUANTITY: item.count,
			})),
		}),
	]);
	console.log("REsult", orderId);
	return orderId;
}
