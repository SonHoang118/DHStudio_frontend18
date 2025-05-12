export const formatVietnameseDate = (dateStr) => {
    const date = new Date(dateStr);

    const options = { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' };
    const datePart = new Intl.DateTimeFormat('vi-VN', options).format(date);

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${datePart} - ${hours}:${minutes}`;
};