export const useCurrency = () => {
    const toMoney = (value: string | number) => {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            minimumFractionDigits: 0,
        })
            .format(Number(value))
            .replace(/\s?₽/g, ' ₽');
    };

    return { toMoney };
};
