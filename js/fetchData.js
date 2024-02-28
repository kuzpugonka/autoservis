export const fetchData = async () => {
  try {
    const response = await fetch("https://fresh-large-space.glitch.me/api");

    if (!response.ok) {
      throw new Error(`HTML error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Ошибка при получении данных: ${error}`);
  }
};
