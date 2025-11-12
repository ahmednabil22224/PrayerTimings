const country = document.getElementById("country").innerHTML;

export const getUrl = (city, year, month) => {
  return `https://api.aladhan.com/v1/calendarByCity/${year}/${month}?country=${country}&city=${city}`;
};

const fetchData = async (url) => {
  let data;
  try {
    const response = await axios.get(url);
    data = response.data.data;
  } catch (err) {
    console.log(err.message);
    return JSON.parse(localStorage.getItem("prayingtimesTable"));
  } finally {
    if (data) {
      data = data.map((day) => {
        const formatedDay = day.timings;
        Object.keys(day.timings).forEach((key) => {
          formatedDay[key.toLowerCase()] = formattedTime(day.timings[key]);
        });

        return { ...day, timings: formatedDay };
      });
      localStorage.setItem("prayingtimesTable", JSON.stringify(data));
      return data;
    }
  }
};

const formattedTime = (prayer) => {
  let hours = prayer.slice(0, 5).split(":").map(Number)[0];
  let minutes = prayer.slice(0, 5).split(":").map(Number)[1];
  minutes = minutes < 10 ? "0" + minutes : minutes;
  if (hours < 12) return `${hours}:${minutes} AM`;
  else if (hours == 12) return `${12}:${minutes} PM`;
  else return `${hours - 12}:${minutes} PM`;
};

export default fetchData;
