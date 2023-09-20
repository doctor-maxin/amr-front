export type ITinkoffShopItem = {
	ShopCode: string;
	Amount: number;
	Name?: string;
	Fee?: string;
};

export enum ITinkoffPaymentTypes {
	full_payment = "full_payment", // полный расчет
	prepayment = "prepayment", // предоплата
	advance = "advance", // аванс
	full_prepayment = "full_prepayment", // предоплата 100%
	partial_payment = "partial_payment", // частичный расчет и кредит
	credit = "credit", // передача в кредит
	credit_payment = "credit_payment", // оплата кредита
}

export type ITinkoffPaymentObject =
	| "commodity"
	| "excise"
	| "job"
	| "service"
	| "gambling_bet"
	| "gambling_prize"
	| "lottery"
	| "lottery_prize"
	| "intellectual_activity"
	| "payment"
	| "agent_commission"
	| "composite"
	| "another";

export type ITinkoffReceiptItem = {
	Name: string;
	Price: number;
	Quantity: number;
	Amount: number;
	PaymentMethod?: ITinkoffPaymentTypes;
	PaymentObject?: ITinkoffPaymentObject;
	Tax: "none" | "vat0" | "vat10" | "vat20" | "vat110" | "vat120";
};

export type ITinkoffReceipt = {
	Items: ITinkoffReceiptItem[];
	FfdVersion?: string;
	Email?: string;
	Phone?: string;
	Taxation:
		| "osn"
		| "usn_income"
		| "usn_income_outcome"
		| "envd"
		| "esn"
		| "patent";
};

export type ITinkoffInitPaymentPayload = {
	amount: number;
	orderId: string;
	email: string;
	phone: string;
	description?: string;
	customerKey?: string;
	Recurrent?: string;
	PayType: "O" | "T";
	Language?: "ru" | "en";
	NotificationURL?: string;
	SuccessURL?: string;
	FailURL?: string;
	RedirectDueDate?: string;
	DATA?: any;
	Shops?: ITinkoffShopItem[];
	Receipt?: ITinkoffReceipt;
};

export type ITinkoffInitPaymentResult = {
	Amount: number;
	OrderId: string;
	Success: boolean;
	Status: string;
	PaymentId: string;
	ErrorCode: string;
	PaymentURL: string;
	Message?: string;
	Details?: string;
};
