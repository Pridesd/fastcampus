
function onSubmit(event){
    event.preventDefault();
    const w = parseFloat(event.target[0].value);
    const h = parseFloat(event.target[1].value);

    if(isNaN(w) || isNaN(h) || w <= 0 || h <= 0){
        alert("제대로 입력해라");
        return;
    }

    const bmi = w / (h*h)
    console.log(bmi)
 //   bmi.toFixed(2) //소수점을 잘라줌
    const res = document.getElementById("result");
    const resBmi = document.getElementById("bmi");
    const resState = document.getElementById("state")
    const meter = document.getElementById("meter");
    meter.value = bmi
    
    resBmi.innerText = bmi.toFixed(2)
    if(bmi >= 35){
        resState.innerText = "고도비만";
        resState.style.color = "mint";
    }else if(bmi >= 23){
        resState.innerText = "비만"
        resState.style.color = "red"
    }else if(bmi >= 18.5){
        resState.innerText = "정상"
        resState.style.color = "green"
    }else{
        resState.innerText = "저체중"
        resState.style.color = "blue"
    }

    res.style.display = "flex"
}

function onReset(){
    const res = document.getElementById("result");
    res.style.display = "none"
}
