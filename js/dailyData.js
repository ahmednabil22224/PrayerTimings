import { format } from "../node_modules/date-fns/index.js";
import fetchData, { getUrl } from "./fetchData.js";

setInterval(() => {
  const timeNow = new Date().toLocaleTimeString();

  document.getElementById("current-time").textContent = timeNow;

  getRemainedTime(timeNow);
}, 1000);

let city = document.getElementById("city").value;
const year = new Date().getFullYear();
const month = new Date().getMonth() + 1;
const prayingTimes = {};

fetchData(getUrl(city, year, month)).then((data) => dailyData(data));

// =========================Daily Data Page==========================
function dailyData(data) {
  data.forEach((day) => {
    if (
      format(day.date.readable, "yyyy MM dd") ===
      format(new Date(), "yyyy MM dd")
    ) {
      document.getElementById("gregorian-day-name").textContent =
        day.date.gregorian.weekday.en;
      document.getElementById("higri-day-name").textContent =
        day.date.hijri.weekday.ar;
      document.getElementById("gregorian-day").textContent =
        day.date.gregorian.day;
      document.getElementById("gregorian-month").textContent =
        day.date.gregorian.month.en;
      document.getElementById("gregorian-year").textContent =
        day.date.gregorian.year;
      document.getElementById("hijri-day").textContent = day.date.hijri.day;
      document.getElementById("hijri-month").textContent =
        day.date.hijri.month.ar;
      document.getElementById("hijri-year").textContent = day.date.hijri.year;

      Object.keys(day.timings).forEach((key) => {
        if (document.getElementById(key)) {
          if (key !== "sunrise") prayingTimes[key] = day.timings[key];
          document.getElementById(key).textContent = day.timings[key];
        }
      });
    }
  });
}

// ================Change Daily Data By Change City==================
document.getElementById("city").onchange = () => {
  city = document.getElementById("city").value;
  fetchData(getUrl(city, year, month)).then((data) => dailyData(data));
};

// ======================Convert Time To Minutes=====================
function convertTime(prayTime) {
  let hours = prayTime.slice(0, 5).split(":").map(Number)[0];
  let minutes = prayTime.slice(0, 5).split(":").map(Number)[1];

  if (prayTime.includes("PM") && hours !== 12)
    return (hours + 12) * 60 + minutes;
  else if (prayTime.includes("AM") && hours === 12) return minutes;
  else return hours * 60 + minutes;
}

// ===================Time Remained For Next Pray====================
function getRemainedTime(timeNow) {
  for (const time of Object.values(prayingTimes)) {
    const remainTimeEle = document.getElementById("remain-time");
    let remainTime, minutes;

    if (convertTime(time) >= convertTime(timeNow)) {
      remainTime = convertTime(time) - convertTime(timeNow);
      minutes = remainTime % 60 < 10 ? `0${remainTime % 60}` : remainTime % 60;
      remainTimeEle.textContent = `${minutes} : ${Math.floor(remainTime / 60)}`;
      break;
    } else if (convertTime(timeNow) > convertTime(prayingTimes["isha"])) {
      remainTime =
        24 * 60 - convertTime(timeNow) + convertTime(prayingTimes["fajr"]);

      minutes = remainTime % 60 < 10 ? `0${remainTime % 60}` : remainTime % 60;

      remainTimeEle.textContent = `${minutes} : ${Math.floor(remainTime / 60)}`;
    }
  }
}
