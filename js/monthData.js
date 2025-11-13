
import fetchData, { getUrl } from "./fetchData.js";

let city = document.getElementById("city").value;
let year = new Date().getFullYear();
let month = new Date().getMonth() + 1;
fetchData(getUrl(city, year, month)).then((data) => monthlyData(data));

const prayingNames = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"];

const praysTimeRow = (day, style) =>
  prayingNames.map((pray) => `<td ${style}>${day.timings[pray]}</td>`).join("");

function monthlyData(data) {
  document.getElementById("tableData").innerHTML = "";
  data.forEach((day) => {
    document.getElementById("tableData").innerHTML += `<tr>
                ${
                  dateFns.format(day.date.readable, "yyyy MM dd") ==
                  dateFns.format(new Date(), "yyyy MM dd")
                    ? `
                                <th scope="row" class="bg-dark text-light">${
                                  day.date.readable
                                }</th>
                                <th scope="row" class="bg-dark text-light text-center">${
                                  day.date.hijri.day
                                } <span class='d-inline-block'>${
                        day.date.hijri.month.ar
                      }</span> ${day.date.hijri.year}</th>
                                ${praysTimeRow(
                                  day,
                                  "class='bg-dark text-light'"
                                )}
                            `
                    : `
                                <th scope="row">${day.date.readable}</th>
                                <th scope="row">${
                                  day.date.hijri.day
                                } <span class='d-inline-block'>${
                        day.date.hijri.month.ar
                      }</span> ${day.date.hijri.year}</th>
                                ${praysTimeRow(day)}
                            `
                }
            </tr>
            `;
  });
}

for (let i = -10; i <= 10; i++) {
  document.getElementById("year").innerHTML += `
        <option value=${new Date().getFullYear() + i} ${i == 0 && "selected"}>${
    new Date().getFullYear() + i
  }</option>
    `;
}

// =================Change Month Data By Change Year=====================
document.getElementById("year").onchange = () => {
  year = document.getElementById("year").value;
  fetchData(getUrl(city, year, month)).then((data) => monthlyData(data));
};

// =================Change Month Data By Change City=====================
document.getElementById("city").onchange = () => {
  city = document.getElementById("city").value;
  fetchData(getUrl(city, year, month)).then((data) => monthlyData(data));
};

// =================Change Month Data By Change Month=====================
document.getElementById("forward").onclick = () => {
  if (month >= 12) return;
  fetchData(getUrl(city, year, ++month)).then((data) => monthlyData(data));
};

document.getElementById("back").onclick = () => {
  if (month <= 1) return;
  fetchData(getUrl(city, year, --month)).then((data) => monthlyData(data));
};
