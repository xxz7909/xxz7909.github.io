//图片切换
let myImage = document.querySelector('img');

myImage.onclick = function(){
    let mySrc = myImage.getAttribute('src');
    if(mySrc === 'images/aniya.png'){
        myImage.setAttribute('src','images/firefox-icon.png');
    }else{
        myImage.setAttribute('src','images/aniya.png');
    }
}

//获取按钮和标题的引用
let myButton = document.querySelector('button');
let myHeading = document.querySelector('h1');

//设置个性化欢迎信息
function setUserName(){
    let myName = prompt('请输入你的名字');
    if(myName==null  || !myName){
        setUserName( );
    }else{
        localStorage.setItem('name',myName );
        myHeading.textContent = '用户名:'+myName;
    }

}

if(!localStorage.getItem('name')){
    setUserName( );
}else{
    let storedName = localStorage.getItem('name');
    myHeading.textContent = '用户名:'+storedName;
}

//为按钮设置 onclick 处理器
myButton.onclick =function() {
    setUserName();
};