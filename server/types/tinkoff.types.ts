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

export type ITinkoffAuthorizePayload = {
	PaymentId: string;
	SendEmail?: boolean;
	Source?: string;
	InfoEmail?: string;
	Amount?: number;
	deviceChannel?: string
	Route?: string;
}
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
export type ITinkoffPaymentStatuses = 'NEW' | 'CANCELED' | 'PREAUTHORIZING' | 'FORMSHOWED'

export type PaymentsCheckOrder = {
	PaymentId: string;
	Amount?: number;
	Status: ITinkoffPaymentStatuses;
	RRN?: string;
	Success: boolean;
	ErrorCode: string;
	Message: string;
}

export type ITinkoffOrderStatusResult = {
	Success: boolean;
	ErrorCode: string;
	Message: string;
	TerminalKey: string;
	OrderId: string;
	Payments: PaymentsCheckOrder[]
}


export type ITinkoffPaymentStatusResult = {
	TerminalKey: string;
	Amount: number;
	Success: boolean;
	OrderId: string;
	Status: ITinkoffPaymentStatuses;
	PaymentId: string;
	ErrorCode: string;
	Message?: string;
	Details?: string;
}