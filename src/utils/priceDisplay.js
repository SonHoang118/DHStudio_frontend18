export const priceDisplay = (price, discount = 0) => {
    let number = parseInt(price, 10);
    let discount_number = parseInt(discount, 10);
    number = number * (1 - (discount_number / 100));
    number = Math.round(number);
    let result = number.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    return result;
}