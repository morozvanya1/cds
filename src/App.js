import "./App.css";
import React from "react";
import {logo, sun, moon} from "./img/index";

function App() {
  const [autoVal, setAutoVal] = React.useState([]);
  const [autoDesc, setAutoDesc] = React.useState([]);
  const [marshRes, setMarshRes] = React.useState();
  const [optVal, setOptVal] = React.useState("");
  const [urlVal, setUrlVal] = React.useState("");
  const [au, setAu] = React.useState(0);
  const [arr, setArr] = React.useState();
  const [bool, setBool] = React.useState(false);
  const [ers, setErs] = React.useState(false);
  const [needChange, setNeedChange] = React.useState(true);
  var cors_api_url = "https://cors-anywhere.herokuapp.com/";

  React.useEffect(() => {
    fetch("/db.json").then((resp) =>
      resp.json().then((json) => {
        setAu(json.elem);
        setAutoVal(json.autoVal);
        setAutoDesc(json.autoDesc);
      })
    );
  }, []);

  const setDarkTheme = React.useCallback(() => {
    if (!needChange) {
      document.querySelector(".App").style.background = "rgb(26, 31, 37)";
      document.querySelector(".darkTheme1").style.color = "rgba(255, 255, 255, 0.75)";
      document.querySelector(".content").style.borderTop = "1px solid rgba(255, 255, 255, 0.1)";
      if (document.querySelector(".darkTheme2") !== null && document.querySelectorAll('.darkTheme3') !== null) {
        document.querySelector(".darkTheme2").style.color = "rgba(255, 255, 255, 1)";
        document.querySelectorAll('.darkTheme3').forEach(function(elem){
          elem.style.color = "rgba(255, 255, 255, 0.75)";
        })
      }
      if (document.querySelector(".darkTheme4") !== null) {
        document.querySelector(".darkTheme4").style.color = "rgba(255, 255, 255, 0.75)";
      }
      document.getElementById("moon").style.background = "rgba(26, 31, 37)";
      document.getElementById("moon").style.borderRadius = "50px";
      document.getElementById("sun").style.background = "none";
      document.getElementById("sun").style.borderRadius = "none";
      document.querySelector(".notWorking").style.color = "rgba(255, 255, 255, 0.1)";
      document.querySelector(".notWorking").style.backgroundColor = "rgba(255, 255, 255, 0.05)";
    } else {
      document.querySelector(".App").style.background = "white";
      document.querySelector(".darkTheme1").style.color = "rgb(26, 31, 37)";
      document.querySelector(".content").style.borderTop = "1px solid rgba(0, 0, 0, 0.1)";
      if (document.querySelector(".darkTheme2") !== null && document.querySelectorAll('.darkTheme3') !== null) {
        document.querySelector(".darkTheme2").style.color = "rgb(26, 31, 37)";
        document.querySelectorAll(".darkTheme3").forEach(function(elem){
          elem.style.color = "rgb(26, 31, 37)";
        })
      }
      if (document.querySelector(".darkTheme4") !== null) {
        document.querySelector(".darkTheme4").style.color = "rgb(26, 31, 37)";
      }
      document.getElementById("sun").style.background = "rgba(255, 255, 255)";
      document.getElementById("sun").style.borderRadius = "50px";
      document.getElementById("moon").style.background = "none";
      document.getElementById("moon").style.borderRadius = "none";
      document.querySelector(".notWorking").style.color = "rgba(255, 255, 255)";
      document.querySelector(".notWorking").style.backgroundColor = "#e6b333";
      document.querySelector(".notWorking").style.opacity = "0.5";
    }
  }, [needChange]);

  React.useEffect(() => {
    setDarkTheme();
  }, [setDarkTheme, needChange, marshRes, bool, ers]);

  const onSetMarsh = () => {
    const select = document.getElementById("marshlist").getElementsByTagName("option");
    for (let i = 0; i < select.length; i++) {
      if (select[i].selected) {
        setArr(au[select[i].value]);
      }
    }
    const autoSelect = document.getElementById("autolist");
    if (autoSelect !== null) {
      autoSelect.value = "";
      setMarshRes();
    }
  }

  function onSetTS(e) {
    const select = document.getElementById("autolist").getElementsByTagName("option");
    for (let i = 0; i < select.length; i++) {
      if (select[i].selected) {
        getInfo(e, select[i].value, select[i].innerHTML);
      }
    }
  }

  const transport = () => {
    onSetMarsh();
  }

  function getTS() {
    onSetTS();
    document.getElementById('autolist').value = "";
  }

  function processResult(v) {
    var from = v.search("marshlist");
    var to = v.length;
    var newStr = v.substring(from, to);
    newStr = newStr.split('</table>')[0];
    newStr = newStr.split("&nbsp </td><td class=\"minutes\">");
    newStr = newStr.join();
    newStr = newStr.substring(">", newStr.length);
    newStr = newStr.split("</td><td>");
    newStr = newStr.join();
    newStr = newStr.split('&nbsp');
    for (var i = 0; i < newStr.length; i++) {
      newStr[i] = newStr[i].split('</a>')[0];
    }
    newStr = newStr.join();
    newStr = newStr.split(', , ,');
    for (var k = 0; k < newStr.length; k++) {
      newStr[k] = newStr[k].split('hlist')[1];
    }
    if (newStr.length > 0) {
      newStr.length--;
    }
    for (var t = 0; t < newStr.length; t++) {
      newStr[t] = newStr[t].split('>')[1];
      newStr[t] = newStr[t].replace(' ,  , ','');
      newStr[t] = newStr[t].split(',');
    }
    return newStr;
  }

  async function getInfo(e, val, desc, url, descVal) {
    console.log("getInfo");
    // var urlField = url !== undefined ? url : "http://localhost:8010/proxy/prediction.php?busstop=" + val;
    var urlField = url !== undefined ? url : cors_api_url + "https://m.cdsvyatka.com/prediction.php?busstop=" + val;
    setUrlVal(urlField);
    setOptVal(descVal = descVal !== undefined ? descVal : "Остановка: " + desc);
    // Запрос на получение информации о прибытии автобусов
    try { 
      const r = await fetch(urlField);
      
      if (!r.ok) {
        console.log(r);
        setMarshRes();
        setBool(false);
        setErs(true);
        throw new Error(`Error! status: ${r.status}`);
      } else {
        console.log(r.status);
        const result = await r.text();
        const newStr = processResult(result);
        setMarshRes(newStr);
        setBool(false);
        setErs(false);
      }
    } catch(error) {
        console.error('Ошибка:', error);
        setMarshRes();
        setBool(true);
        setErs(false);
    }
  }

  return (
    <div className="App">
      <header>
        <img src={logo} alt="logo"/>
        <h1>ЦДС Вятка</h1>
        <div id="darkTheme">
          <img src={sun} alt="logo" id="sun" onClick={() => setNeedChange(!needChange)}/>
          <img src={moon} alt="logo" id="moon" onClick={() => setNeedChange(!needChange)}/>
        </div>
      </header>
      <div className="content-header">
        <p className="darkTheme1">Поиск по маршруту</p>
        <select name="marshlist" id="marshlist" onChange={() => transport()} defaultValue="">
          <option value="" disabled selected hidden>Нажмите...</option>
          {autoDesc.map((v, i) => (
            <option key={i} value={autoVal[i]}>
              {v}
            </option>
          ))}
        </select>
      </div>
      {arr && (<div className="content-change">
          <select name="autolist" id="autolist" onChange={() => getTS()} defaultValue="">
            <option value="" disabled selected hidden>Выберите остановку...</option>
            {arr && arr.map((v,i) => {
              // console.log(v + " --- " + i + " --- " + arr.length);
              return (
                <option key={i} value={v.slice(0, v.indexOf(' '))}>
                  {v.slice(v.indexOf(' '), v.length)}
                </option>)})}
          </select>
      </div>)}
      <div className="content">
        {marshRes && <h3 className="darkTheme2">{optVal}</h3>}
        <table>
        {marshRes && (<tr className="table"><th>Маршрут</th><th>Ожидание</th><th>Конечная</th></tr>)}
        {ers && <div className="darkTheme4">Доступ запрещен, активируйте по кнопке ниже</div>}
        {bool && <div className="darkTheme4">Данные не найдены, попробуйте обновить страницу</div>}
        {marshRes && marshRes.map((v,i) => (
          <tr key={i}>
            <td className="darkTheme3">{v[0]}</td>
            <td className="darkTheme3">{v[1]}</td>
            <td className="darkTheme3">{v[2]}</td>
          </tr>
        ))}
        </table>
        {(bool || marshRes) && (<button onClick={(e) => getInfo(e, "", "", urlVal, optVal)}>Обновить</button>)}
      </div>
      <a href="https://cors-anywhere.herokuapp.com/corsdemo" className="notWorking">Если не работает</a>
    </div>
  );
}

export default App;