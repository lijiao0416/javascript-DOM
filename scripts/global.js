function addLoadEvent(func){
    var oldonload=window.onload;
    if(typeof window.onload!='function'){
        window.onload=func;
    }else{
        window.onload=function () {
            oldonload();
            func();
        }
    }
}

function insertAfter(newElement,targetElement) {
    var parent=targetElement.parentNode;
    if(parent.lastChild==targetElement){
        parent.appendChild(newElement);
    }else{
        parent.insertBefore(newElement,targetElement.nextSibling);
    }
}

//添加新的class属性
function addClass(element,value) {
    if(!element.className){
        element.className=value;
    }else{
        newClassName=element.className;//原有的类名
        newClassName+=" ";
        newClassName+=value;
        element.className=newClassName;
    }
}

//打算移动的元素 该元素的目的地左位置 该元素的目的地上位置 两次移动之间的停顿时间
function moveElement(elementID,final_x,final_y,interval) {
    if(!document.getElementById) return false;
    if(!document.getElementById(elementID)) return false;
    var elem=document.getElementById(elementID);
    //保证滑动的更加平稳
    if(elem.movement){
        clearTimeout(elem.movement);
    }
    //安全检查
    if(!elem.style.top){
        elem.style.top='0px';
    }
    if(!elem.style.left){
        elem.style.left='0px';
    }
    var xpos=parseInt(elem.style.left);
    var ypos=parseInt(elem.style.top);
    var dist=0;
    if(xpos==final_x && ypos==final_y){
        return true;
    }
    if(xpos<final_x){
        dist=Math.ceil((final_x-xpos)/10);
        xpos=xpos+dist;
    }
    if(xpos>final_x){
        dist=Math.ceil((xpos-final_x)/10);
        xpos=xpos-dist;
    }
    if(ypos<final_y){
        dist=Math.ceil((final_y-ypos)/10);
        ypos=ypos+dist;
    }
    if(ypos>final_y){
        dist=Math.ceil((ypos-final_y)/10);
        ypos=ypos-dist;
    }
    elem.style.left=xpos+"px";
    elem.style.top=ypos+"px";
    var repeat="moveElement('"+elementID+"',"+final_x+","+final_y+","+interval+")";
    elem.movement=setTimeout(repeat,interval);//movement设置成elem的一个属性
}

function highlightPage() {
    if(!document.getElementsByTagName) return false;
    if(!document.getElementById) return false;
    var headers=document.getElementsByTagName("header");
    if(headers.length==0) return false;
    var navs=headers[0].getElementsByTagName("nav");
    if(navs.length==0) return false;
    var links=navs[0].getElementsByTagName("a");
    var linkurl;
    for(var i=0;i<links.length;i++){
        linkurl=links[i].getAttribute("href");
        if(window.location.href.indexOf(linkurl)!=-1){//获取当前页面的链接并比较
            links[i].className="here";
            //在body中添加属性
            var linktext=links[i].lastChild.nodeValue.toLowerCase();
            document.body.setAttribute("id",linktext);
        }
    }
}

function prepareSlideshow(){
    if(!document.getElementsByTagName) return false;
    if(!document.getElementById) return false;
    if(!document.getElementById("intro")) return false;
    var intro=document.getElementById("intro");
    var slideshow=document.createElement("div");
    slideshow.setAttribute("id","slideshow");
    var preview=document.createElement("img");
    preview.setAttribute("src","images/slideshow.jpg");
    preview.setAttribute("alt","a glimpse of what awaits you");
    preview.setAttribute("id","preview");
    slideshow.appendChild(preview);
/*
    var frame=document.createElement("img");
    frame.setAttribute("src","images/frame.jpg");
    frame.setAttribute("alt","");
    frame.setAttribute("id","frame");
    slideshow.appendChild(frame);
*/
    insertAfter(slideshow,intro);
    //var links=intro.getElementsByTagName("a");
    var links=document.getElementsByTagName("a");
    var destination;
    for(var i=0;i<links.length;i++){
        links[i].onmouseover=function(){
            destination=this.getAttribute("href");
            if(destination.indexOf("index.html")!=-1){
                moveElement("preview",0,0,5);
            }
            if(destination.indexOf("about.html")!=-1){
                moveElement("preview",-150,0,5);
            }
            if(destination.indexOf("photos.html")!=-1){
                moveElement("preview",-300,0,5);
            }
            if(destination.indexOf("live.html")!=-1){
                moveElement("preview",-450,0,5);
            }
            if(destination.indexOf("contact.html")!=-1){
                moveElement("preview",-600,0,5);
            }
        }
    }
}

function showSection(id){
    var sections=document.getElementsByTagName("section");
    for(var i=0;i<sections.length;i++){
        if(sections[i].getAttribute("id")!=id){
            sections[i].style.display="none";
        }else{
            sections[i].style.display="block";
        }
    }
}

function prepareInternalnav(){
    if(!document.getElementsByTagName) return false;
    if(!document.getElementById) return false;
    var articles=document.getElementsByTagName("article");
    if(articles.length==0) return false;
    var navs=articles[0].getElementsByTagName("nav");
    if(navs.length==0) return false;
    var nav=navs[0];
    var links=nav.getElementsByTagName("a");
    for(var i=0;i<links.length;i++){
        var sectionId=links[i].getAttribute("href").split("#")[1];//获得以#为分隔符字符串保存在数组中
        if(!document.getElementById(sectionId)) continue;
        document.getElementById(sectionId).style.display="none";//先全部隐藏
        links[i].destination=sectionId;//为每个链接创建一个自定义的属性 sectionId是一个局部变量，只在当前函数执行期间存在，到事件处理函数执行的时候不存在了
        links[i].onclick=function () {
            showSection(this.destination);
            return false;//取消默认行为
        }
    }
}

//在下面的区域中显示点击的图片
function showPic(whichPic){
    if(!document.getElementById("placeholder")){
        return false;
    }
    var source=whichPic.getAttribute("href");
    var placeholder=document.getElementById("placeholder");
    if(placeholder.nodeName!="IMG"){
        return false;
    }
    placeholder.setAttribute("src",source);
    //placeholder.src=source;
    if(document.getElementById("description")){
        if(whichPic.getAttribute("title")){
            var text=whichPic.getAttribute("title");
        }else{
            var text=" ";
        }
        var description=document.getElementById("description");
        if(description.firstChild.nodeType==3){
            description.firstChild.nodeValue=text;
        }
    }
    return true;//返回true 确定该函数可以实现
}

function prepaarePlaceholder(){
    if(!document.getElementById||!document.createElement||!document.createTextNode) {
        return false;
    }
    if(!document.getElementById("imagegallery")){
        return false;
    }//对象检测

    var placeholder=document.createElement("img");
    placeholder.setAttribute("id","placeholder");
    placeholder.setAttribute("src","images/xiaoImage.jpg");
    placeholder.setAttribute("alt","my image gallery");
    var description=document.createElement("p");
    description.setAttribute("id","description");
    var desctext=document.createTextNode("Choose an image");
    description.appendChild(desctext);
    //document.getElementsByTagName("body")[0].appendChild(placeholder);
    //document.getElementsByTagName("body")[0].appendChild(description);//这两组语句会把placeholder和description元素插入到位于文档末尾的</body>标签之前
    var gallery=document.getElementById("imagegallery");
    insertAfter(description,gallery);
    insertAfter(placeholder,description);
}

function prepareGallery() {
    if(!document.getElementsByTagName||!document.getElementById) {
        return false;
    }
    if(!document.getElementById("imagegallery")){
        return false;
    }//对象检测

    var gallery=document.getElementById("imagegallery");
    var links=gallery.getElementsByTagName("a");
    for(var i=0;i<links.length;i++){
        links[i].onclick=function(){
            if(showPic(this)){
                return false;
            }else{
                return true;
            }
        }
    }
}

function stripeTables(){
    if(!document.getElementsByTagName) return false;
    var tables=document.getElementsByTagName("table");
    var odd,rows;//奇数 行
    for(var i=0;i<tables.length;i++){
        odd=false;
        rows=tables[i].getElementsByTagName("tr");
        for(var j=0;j<rows.length;j++){
            if(odd==true){
                //rows[j].style.backgroundColor="#ffc";
                addClass(rows[j],"odd")
                odd=false;
            }else{
                odd=true;
            }
        }
    }
}

//把鼠标指针悬停在某个表格行的上方，该行文本加黑加粗
function highlightRows() {
    if (!document.getElementsByTagName) return false;
    var rows=document.getElementsByTagName("tr");
    for(var i=0;i<rows.length;i++){
        rows[i].oldClassName=rows[i].className;
        rows[i].onmouseover=function () {
            addClass(this,"highlight")
        }
        rows[i].onmouseout=function () {
            this.className=this.oldClassName;
        }
    }
}

//显示缩略词列表的函数
function displayAbbreviations() {
    //检查兼容性
    if(!document.getElementsByTagName||!document.createElement||!document.createTextNode) return false;

    //取得所有的缩略词
    var abbreviations=document.getElementsByTagName("abbr");
    if(abbreviations.length<1) return false;//文档中没有abbr元素，函数结束
    var defs=new Array();

    //遍历这些缩略词
    for(var i=0;i<abbreviations.length;i++){
        var current_abbr=abbreviations[i];
        if(current_abbr.childNodes.length<1) continue;
        var definition=current_abbr.getAttribute("title");
        var key=current_abbr.lastChild.nodeValue;
        defs[key]=definition;//关联数组 遍历的方式for(key in defs)
    }

    //创建定义列表
    var dlist=document.createElement("dl");

    for(key in defs){
        var definition=defs[key];
        //创建定义标题
        var dtitle=document.createElement("dt");
        var dtitle_text=document.createTextNode(key);
        dtitle.appendChild(dtitle_text);
        var ddesc=document.createElement("dd");
        var ddesc_text=document.createTextNode(definition);
        ddesc.appendChild(ddesc_text);
        //将它们创建到定义列表
        dlist.appendChild(dtitle);
        dlist.appendChild(ddesc);
    }
    if(dlist.childNodes.length<1) return false;
    //创建标题
    var header=document.createElement("h3");
    var header_text=document.createTextNode("Abbreviations");
    header.appendChild(header_text);
    var articles=document.getElementsByTagName("article");
    if(articles.length==0) return false;
    var container=articles[0];
    container.appendChild(header);
    container.appendChild(dlist);
}

function focusLabels(){
    if(!document.getElementsByTagName) return false;
    var labels=document.getElementsByTagName("label");
    for(var i=0;i<labels.length;i++){
        if(!labels[i].getAttribute("for")) continue;
        labels[i].onlick=function () {
            var id=this.getAttribute("for");
            if(!document.getElementById) return false;
            var element=document.getElementById(id);
            element.focus();//获取焦点
        }
    }
}
//有问题
function resetFields(whichform){
    for(var i=0;i<whichform.elements.length;i++){//表单自带的属性 form.elements.length 返回值不是数组 而是包含的标签等
        var element=whichform.elements[i];
        if(element.type=="submit") continue;
        var check=element.placeholder||element.getAttribute("placeholder");
        if(!check) continue;
        //var text=element.placeholder||element.getAttribute("placeholder");
        element.onfocus=function () {
            var text=this.placeholder||this.getAttribute("placeholder");
                if(this.value==text){
                    this.className="";
                    this.value="";
                }
        }
        element.onblur=function () {
                if(this.value==""){
                    this.className="placeholder";
                    this.value=this.placeholder||this.getAttribute("placeholder");
                    //this.value=text;
                }
        }
        element.onblur();
    }
}

function prepareForms(){
    for(var i=0;i<document.forms.length;i++){
        var thisform=document.forms[i];
        resetFields(thisform);
        thisform.onsubmit=function () {
            if(!validateForm(this)) return false;
            var article=document.getElementsByTagName('acticle')[0];
            if(submitFormWithAjax(this,article)) return false;
            return true;
        }
    }
}

//验证是否输入了内容
function isFilled(field){
    if(field.value.replace(' ','').length==0) return false;
    var placeholder=field.placeholder||field.getAttribute('placeholder');
    return (field.value!=placeholder);
}
function isEmail(field){
    return (field.value.indexOf("@")!=-1&&field.value.indexOf(".")!=-1);
}
function validateForm(whichform){
    for(var i=0;i<whichform.elements.length;i++){
        var element=whichform.elements[i];
        if(element.required=="required"){
            if(!isFilled(element)){
                alert("Pleace fill in the "+element.name+" field");
                return false;
            }
        }
        if(element.type=='email'){
            if(!isEmail(element)){
                alert("The "+element.name+" field must be a valis email address.")
            }
        }
    }
    return true;
}

//表单提交之后，拦截提交请求，自己显示结果
function getHTTPObject() {
    if(typeof XMLHTTPRequest=='undefined')
        XMLHTTPRequest=function(){
            try{return new ActiveXObject("Msxml2.XMLHTTP.6.0");}
            catch (e) {}
            try{return new ActiveXObject("Msxml2.XMLHTTP.3.0");}
            catch (e) {}
            try{return new ActiveXObject("Msxml2.XMLHTTP");}
            catch (e){}
            return false;
        }
    return new XMLHttpRequest()
}
function displayAjaxLoading(element){
    while(element.hasChildNodes()){
        element.removeChild(element.lastChild);//删所除有的子元素
    }
    var content=document.createElement("img");
    content.setAttribute("src","images/loading.gif");
    content.setAttribute("alt","Loading...");
    element.appendChild(content);
}
function submitFormWithAjax(whichform,thetarget){
    var request=getHTTPObject();
    if(!request){return false;}
    displayAjaxLoading(thetarget);
    var dataParts=[];
    var element;
    for(var i=0;i<whichform.elements.length;i++){
        element=whichform.elements[i];
        dataParts[i]=element.name+'='+encodeURIComponent(element.value);
    }
    var data=dataParts.join('&');
    request.open('POST',whichform.getAttribute("action"),true);
    request.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    request.onreadystatechange=function () {
        if(onreadystatechange==4){
            if(request.status==200||request.status==0){
                var matches=request.responseText.match(/<article>([\s\S]+)<\/acricle>/);
                if(matches.length>0){
                    thetarget.innerHTML=matches[1];
                }else{
                    thetarget.innerHTML='<p>Oops,there was anerror.Sorry.</p>';
                }
            }else{
                thetarget.innerHTML='<p>'+request.statusText+'</p>';
            }
        }
    };
    request.send(data);
    return true;
}



addLoadEvent(highlightPage);
addLoadEvent(prepareSlideshow);
addLoadEvent(prepareInternalnav);
addLoadEvent(prepaarePlaceholder);
addLoadEvent(prepareGallery);
addLoadEvent(stripeTables);
addLoadEvent(highlightRows);
addLoadEvent(displayAbbreviations);
addLoadEvent(focusLabels);
addLoadEvent(prepareForms);