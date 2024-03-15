let QUERY_URL="api/v1/index/0/query"
const STATUS_URL="api/v1/index/0";const API_KEY="AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";function highlight(text,query){query.replace(new RegExp('"',"gi"),"").split(" ").forEach(keyword=>{if(keyword)text=text.replace(new RegExp(keyword,"gi"),"<b>$&</b>");});return text;}
function debounce(func,wait,immediate){var timeout;return function(){var context=this,args=arguments;var later=function(){timeout=null;if(!immediate)func.apply(context,args);};var callNow=immediate&&!timeout;clearTimeout(timeout);timeout=setTimeout(later,wait);if(callNow)func.apply(context,args);};}
function moveSplitter(y,hide=false){const[l1,l2,l3,l4]=[$("#l1"),$("#l2"),$("#l3"),$("#l4")];l1.attr("y2",y-70);l2.attr("y1",y-70);l2.attr("y2",y-30);l3.attr("y1",y-30);l3.attr("y2",y+10);l4.attr("y1",y+10);if(hide)$("#splitter").hide();else $("#splitter").show();}
let query="";let trueQuery="";let maxPages=-1;let currPage=1;function updateTitle(useDefault=false){const title=query&&!useDefault?`${query}-SeekStorm Search`:"SeekStorm Search";if(document.title!=title){document.title=title;}}
let active=null;function setHeader(xhr){xhr.setRequestHeader('apikey',API_KEY);}
function truncate(input,len)
{}
function loadResults(page,ignoreHistory=false){updateTitle();active=null;if(currPage!=page&&!ignoreHistory){var newURL=updateURLParameter(window.location.href,"q",query);newURL=updateURLParameter(newURL,"page",page);window.history.pushState("","",newURL);}
currPage=page;const contentBox=$("#contentBox");const prevUrl=$("#prevUrl");const prevTitle=$("#prevTitle");const prevText=$("#prevText");moveSplitter(-50,true);prevUrl.text("");prevTitle.text("");prevText.text("");$.ajax({url:QUERY_URL,data:JSON.stringify({query:query,offset:(page-1)*10,length:10,realtime:true,highlights:[{field:"title",fragment_number:0,fragment_size:1000,highlight_markup:true},{field:"body",fragment_number:2,fragment_size:160,highlight_markup:true}]}),traditional:true,cache:false,type:"POST",dataType:'json',success:function(data){contentBox.empty();trueQuery=data.query;if(data.query.toLowerCase().startsWith(query.toLowerCase())){$("#searchMain").removeClass("wrong");}else{$("#searchMain").addClass("wrong");}
data.results.forEach(element=>{const iUrl=element.iurl;let newEntry=$(`<div class="resultEntry col-xs-12"><div class="row">${iUrl?`<div class="col-xs-2 imgPrev"style="background-image: url('${iUrl}')"></div>`:""}<div class="col-xs-${iUrl ? 10 : 12}"><h1><img height="14px"src="favicon-16x16.png"></img><a href="${element.url}">${element._title}</a></h1><p class="kwic">${element._body}</p><p class="directLink"><a href="${element.url}">${element.url}</a></p></div></div></div>`);contentBox.append(newEntry);newEntry.hover(()=>{moveSplitter(newEntry[0].getBoundingClientRect().y);prevUrl.text(element.domain);prevTitle.text(element.title);prevText.html(element.body.replace(new RegExp("\r","gi"),"<br>"));});});$("#suggestions").empty();if(data.suggestions.length==0)$("#contentBox").css({marginTop:15});else if($("#searchMain").is(":focus"))
$("#contentBox").css({marginTop:100});data.suggestions.forEach(sugg=>{const beg=0;if(sugg.startsWith(query)){$("#suggestions").append(`<li value="${sugg}">${query}<b>${sugg.substring(query.length)}</b></li>`);}else{$("#suggestions").append(`<li value="${sugg}"><b>${sugg}</b></li>`);}
$("#suggestions li").last().click(()=>$("#searchMain").val(sugg).trigger("input"));});setPage(page,data.count,data.count_evaluated,data.time);},error:function(xhr){alert("error");},beforeSend:setHeader});}
function showStatus()
{$.ajax({url:STATUS_URL,data:{},traditional:true,cache:false,type:"GET",dataType:'json',success:function(data){$("#version").text(data.version);$("#indexedDocs").text(data.indexed_doc_count.toLocaleString());},error:function(xhr){alert("error");},beforeSend:setHeader});}
function setPage(page,results,count_evaluated,statsTime){maxPages=Math.ceil(count_evaluated/10);let vars=$("#footer").children();const[from,to,count,stats]=[$("#from"),$("#to"),$("#count"),$("#stats")];from.text(((page-1)*10+1).toLocaleString());to.text(Math.min(page*10,count_evaluated).toLocaleString());count.text(count_evaluated.toLocaleString());stats.attr("title",`${count_evaluated.toLocaleString()}results in ${(statsTime/1000_000).toLocaleString(undefined,{minimumFractionDigits:0,maximumFractionDigits:3})}ms`);for(const element of vars){const elem=$(element);elem.removeClass("active");elem.show();}
if(page==1)$(vars[0]).hide();else $(vars[0]).show();if(page==maxPages)$(vars[11]).hide();else $(vars[11]).show();if(page>5){for(let i=0;i<10;i++){const element=$(vars[i+1]);element.text(page-5+i);if(i==5){element.addClass("active");}
if(page-5+i>maxPages){element.hide();}}}else{for(let i=0;i<10;i++){const element=$(vars[i+1]);element.text(i+1);if(i==page-1){element.addClass("active");}
if(i>=maxPages){element.hide();}}}}
$(function(){const acvtivate=elem=>{if(active)active.removeClass("active");elem.addClass("active");active=elem;$("#searchMain").val(elem.attr("value"));};$("#searchMain").focus(()=>{$("#suggestions").show();$("#contentBox").css({marginTop:100});});$("#searchMain").blur(()=>{setTimeout(()=>{$("#suggestions").hide();$("#contentBox").css({marginTop:15});},200);});$("#searchMain").keydown(function(e){switch(e.which){case 13:if($("#searchMain").val()==query){$("#searchMain").val(trueQuery);}
$("#searchMain").blur();$("#searchMain").trigger("input");break;case 38:if(!active||active.prev().length==0){const elems=$("#suggestions li");if(elems.length>0){acvtivate($(elems[elems.length-1]));}}else{acvtivate(active.prev());}
break;case 40:if(!active||active.next().length==0){const elems=$("#suggestions li");if(elems.length>0){acvtivate($(elems[0]));}}else{acvtivate(active.next());}
break;default:return;}
e.preventDefault();});$("#searchInput").on("input",function(e){e.preventDefault();$("#landingSearch").hide();$("#landingMain").show();$("#searchMain").val($("#searchInput").val()).trigger("input");$("#searchMain").focus();$("#searchInput").val("");});$("#footer, #topBar").hover(()=>{const prevUrl=$("#prevUrl");const prevTitle=$("#prevTitle");const prevText=$("#prevText");moveSplitter(-50,true);prevUrl.text("");prevTitle.text("");prevText.text("");});$("#topLogo").on("click",function(e){e.preventDefault();$("#landingSearch").show();$("#searchInput").focus();$("#landingMain").hide();updateTitle(true);window.history.pushState("","",window.location.href.split("?")[0]);});const mainSearch=$("#searchMain");mainSearch.on("input",debounce(()=>{query=mainSearch.val();loadResults(1);},50));mainSearch.on("input",debounce(()=>{var newURL=updateURLParameter(window.location.href,"q",query);newURL=updateURLParameter(newURL,"page",1);window.history.pushState("","",newURL);},700));$("#footer div").click(event=>{let target=$(event.target);if(!target.hasClass("action")){loadResults(target.text());}else{const cPage=parseInt($("#footer div.active")[0].innerText);if(target.attr("next")){loadResults(cPage+1);}else{loadResults(cPage-1);}}});window.addEventListener("popstate",function(e){checkUrl();});checkUrl();showStatus();});function checkUrl(){const queryStrings=parse_query_string(window.location.search.substr(1));if(queryStrings.q){query=queryStrings.q;let loadPage=1;if(queryStrings.page)loadPage=parseInt(queryStrings.page);loadResults(loadPage,true);$("#searchMain").val(query);$("#landingSearch").hide();$("#landingMain").show();}else{$("#landingSearch").show();$("#searchInput").focus();$("#landingMain").hide();}}
$(document).keydown(function(e){if($("#searchMain").is(":focus")||$("#footer div.active")[0]===undefined)
return;const cPage=parseInt($("#footer div.active")[0].innerText);switch(e.which){case 38:if(cPage>1)loadResults(cPage-1);break;case 40:if(cPage<maxPages)loadResults(cPage+1);break;default:return;}
e.preventDefault();});document.addEventListener("touchstart",handleTouchStart,false);document.addEventListener("touchmove",handleTouchMove,false);var xDown=null;var yDown=null;function getTouches(evt){return(evt.touches||evt.originalEvent.touches);}
function handleTouchStart(evt){const firstTouch=getTouches(evt)[0];xDown=firstTouch.clientX;yDown=firstTouch.clientY;}
function handleTouchMove(evt){if(!xDown||!yDown){return;}
var xUp=evt.touches[0].clientX;var yUp=evt.touches[0].clientY;var xDiff=xDown-xUp;var yDiff=yDown-yUp;if(Math.abs(xDiff)>Math.abs(yDiff)){const cPage=parseInt($("#footer div.active")[0].innerText);if(xDiff>0){if(cPage<maxPages)loadResults(cPage+1);}else{if(cPage>1)loadResults(cPage-1);}}else{if(yDiff>0){}else{}}
xDown=null;yDown=null;}
function updateURLParameter(url,param,paramVal){var TheAnchor=null;var newAdditionalURL="";var tempArray=url.split("?");var baseURL=tempArray[0];var additionalURL=tempArray[1];var temp="";if(additionalURL){var tmpAnchor=additionalURL.split("#");var TheParams=tmpAnchor[0];TheAnchor=tmpAnchor[1];if(TheAnchor)additionalURL=TheParams;tempArray=additionalURL.split("&");for(var i=0;i<tempArray.length;i++){if(tempArray[i].split("=")[0]!=param){newAdditionalURL+=temp+tempArray[i];temp="&";}}}else{var tmpAnchor=baseURL.split("#");var TheParams=tmpAnchor[0];TheAnchor=tmpAnchor[1];if(TheParams)baseURL=TheParams;}
if(TheAnchor)paramVal+="#"+TheAnchor;var rows_txt=temp+""+param+"="+paramVal;return baseURL+"?"+newAdditionalURL+rows_txt;}
function parse_query_string(query){var vars=query.split("&");var query_string={};for(var i=0;i<vars.length;i++){var pair=vars[i].split("=");var key=decodeURIComponent(pair[0]);var value=decodeURIComponent(pair[1]);if(typeof query_string[key]==="undefined"){query_string[key]=decodeURIComponent(value);}else if(typeof query_string[key]==="string"){var arr=[query_string[key],decodeURIComponent(value)];query_string[key]=arr;}else{query_string[key].push(decodeURIComponent(value));}}
return query_string;}