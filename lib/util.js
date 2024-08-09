// Function to capitalize the first letter of a string
export const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Function to format a number with commas
export const formatNumberWithCommas = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Function to generate a random alphanumeric string
export const generateRandomString = (length) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

// Function to debounce a function call
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
};

export function formatDate(dateStr) {
  // Create a new Date object from the input string
  const date = new Date(dateStr);

  // Define an array of month names
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Get the day, month, and year from the Date object
  const day = date.getDate();
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}

export function formatThousands(num) {
  return `${(num / 1000).toFixed(1)}K`;
}

export function formatMillions(num) {
  return `${(num / 1000000).toFixed(1)}M`;
}

export function formatNumber(num) {
  if (num < 1000) {
    return num.toFixed(1);
  } else if (num < 1000000) {
    return formatThousands(num);
  } else {
    return formatMillions(num);
  }
}
