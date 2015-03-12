/*!
 *
 *  Web Starter Kit
 *  Copyright 2014 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */
(function () {
  'use strict';

  var querySelector = document.querySelector.bind(document);

  var navdrawerContainer = querySelector('.navdrawer-container');
  var body = document.body;
  var appbarElement = querySelector('.app-bar');
  var menuBtn = querySelector('.menu');
  var main = querySelector('main');
  var search = document.getElementById('searchBox');
  var size = document.getElementById("options");

  function closeMenu() {
    body.classList.remove('open');
    appbarElement.classList.remove('open');
    navdrawerContainer.classList.remove('open');
  }

  function toggleMenu() {
    body.classList.toggle('open');
    appbarElement.classList.toggle('open');
    navdrawerContainer.classList.toggle('open');
    navdrawerContainer.classList.add('opened');
  }

  main.addEventListener('click', closeMenu);
  (search === null)? console.log(""):search.addEventListener('submit', closeMenu);
  if(size !== null&&localStorage.getItem("size") !== null){ 
    size.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.value = localStorage.getItem("size");
    document.getElementById("range").innerHTML = size.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.value;
  }
  menuBtn.addEventListener('click', toggleMenu);
  navdrawerContainer.addEventListener('click', function (event) {
    if (event.target.nodeName === 'A' || event.target.nodeName === 'LI') {
      closeMenu();
    }
  });
})();

var MYAPP = {};
MYAPP.images = {};
MYAPP.search = {};
MYAPP.options = {};
MYAPP.images.loading = false;

MYAPP.images.flickr = new Flickr({
  api_key: "1f9e802ce325c99a1bb4388e8858a363"
});

MYAPP.images.getWidth = function(elem) {
  var a = (localStorage.getItem("size")===null)?4:localStorage.getItem("size");

  switch (+a) {
  case 1:
    elem.style.maxWidth = "100%";
    elem.style.minWidth = "100%";
    break
  case 2:
    elem.style.maxWidth = "49%";
    elem.style.minWidth = "49%";
    break
  case 3:
    elem.style.maxWidth = "32%";
    elem.style.minWidth = "32%";
    break
  case 4:
    elem.style.maxWidth = "24%";
    elem.style.minWidth = "24%";
    break
  case 5:
    elem.style.maxWidth = "19%";
    elem.style.minWidth = "19%";
    break
  default:
    
}
}

MYAPP.search.get_action = function(searchBox) {
  if(MYAPP.search.block) {
    alert("Недопустимые символы")
  }

  else {
  MYAPP.images.loading = true;
  MYAPP.images.flickr.photos.search({
  text: searchBox.value,
  page: 1,
  per_page: (localStorage.getItem("quntity")===null||localStorage.getItem("quntity")==="")?10:localStorage.getItem("quntity")
}, function(err, result) {
  if(err) { throw new Error(err); }
  var photos = result.photos.photo,
      photoContainer = document.getElementById("as"),
      photosOnPage = photoContainer.childNodes,
      i;

      console.log(result);

 for (i = 0; i<photosOnPage.length; i++) {
      photoContainer.removeChild(photoContainer.firstChild);
  }
 

  for (i = 0; i < photos.length; i ++) {
      var img = document.createElement("img");
      MYAPP.images.getWidth(img);

      img.setAttribute("id", result.photos.photo[i].id );
      img.setAttribute("alt", result.photos.photo[i].title );
      img.setAttribute("src","https://farm"+result.photos.photo[i].farm +".staticflickr.com/"+result.photos.photo[i].server+"/"+result.photos.photo[i].id+"_"+result.photos.photo[i].secret+".jpg"); 
      photoContainer.appendChild(img);
  }

  for (i = 0; i<photosOnPage.length; i++) {
      photosOnPage[i].setAttribute("onclick", "MYAPP.images.toggleBigPhoto(this)");
  }

  localStorage.setItem("searchQuery", searchBox.value);
  localStorage.setItem("page", 1 + result.photos.page);
  MYAPP.images.loading = false;
});
}
}


MYAPP.search.checkForNumbers = function(inp) {
    var re = /^[0-9]*$/gi;
    if(!re.test(inp.value)&&inp.value !== "") {
        inp.style.backgroundColor = "#E26C62";
        MYAPP.options.block = true;
    }

    else {
        inp.style.backgroundColor = "";
        MYAPP.options.block = false;
    }
}


MYAPP.images.toggleBigPhoto = function(elem) {
     MYAPP.images.flickr.photos.getSizes({
         photo_id: elem.id
}, function(err, result) {
  if(err) { throw new Error(err); }
  
  var sizes = result.sizes.size,
      bigPicture = document.getElementById("bigPhoto"),
      img = document.getElementById("bigPhotoImg"),
      p = img.nextSibling;
  img.setAttribute("src", "");
  img.setAttribute("src", sizes[sizes.length-2].source);
  p.innerHTML = elem.alt;
  bigPicture.style.visibility = "visible";

});
}

MYAPP.images.hideBigPhoto = function() {
  document.getElementById("bigPhoto").style.visibility = "hidden";
}

MYAPP.options.get_action = function() {
  if(MYAPP.options.block) {
    document.getElementById("message").firstChild.innerHTML = "Недопустимое значение";
    document.getElementById("message").style.visibility = "visible";

    setTimeout('document.getElementById("message").style.visibility = "hidden"', 3000)
 
  }

  else {
      var options = document.getElementById("options"),
          quntity = options.firstChild.nextSibling.value,
          size = options.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.value;


      if(quntity === ""&&localStorage.getItem("quntity")!==null) {

      }

      else if(quntity !== "") {
        localStorage.setItem("quntity",quntity);
      }


      localStorage.setItem("size",size);

      document.getElementById("message").firstChild.innerHTML = "Настройки сохранены";
      document.getElementById("message").style.visibility = "visible";

      setTimeout('document.getElementById("message").style.visibility = "hidden"', 3000)
  }
}

MYAPP.options.showValue = function(newValue)
{
  document.getElementById("range").innerHTML=newValue;
}


MYAPP.images.like =  function(){
  var link = document.getElementById("bigPhotoImg").getAttribute("src");
  var caption = document.getElementById("bigPhotoImg").nextSibling.innerHTML;
      FB.ui(
      {
      method: 'feed',
      name: 'Фото с Flickr',
      link: link,
      picture: link,
      caption: caption,
      description: 'Вот такое фото',
      message: ''
      });
      }

MYAPP.images.loadMore = function() {
  var scrolled = window.pageYOffset || document.documentElement.scrollTop;
  
  if(scrolled > document.getElementById('as').clientHeight - 1000 && MYAPP.images.loading === false){
    MYAPP.images.loading = true;
    MYAPP.images.flickr.photos.search({
      text: localStorage.getItem("searchQuery"),
      page: localStorage.getItem("page"),
      per_page: (localStorage.getItem("quntity")===null||localStorage.getItem("quntity")==="")?10:localStorage.getItem("quntity")

      }, function(err, result) {
  
            if(err) { throw new Error(err); }
            
            var photos = result.photos.photo,
                photoContainer = document.getElementById("as"),
                photosOnPage = photoContainer.childNodes,
                i;

      console.log(result); 

            for (i = 0; i < photos.length; i ++) {
                var img = document.createElement("img");
                MYAPP.images.getWidth(img);

                img.setAttribute("id", result.photos.photo[i].id );
                img.setAttribute("alt", result.photos.photo[i].title );
                img.setAttribute("src","https://farm"+result.photos.photo[i].farm +".staticflickr.com/"+result.photos.photo[i].server+"/"+result.photos.photo[i].id+"_"+result.photos.photo[i].secret+".jpg"); 
                photoContainer.appendChild(img);
            }

            for (i = 0; i<photosOnPage.length; i++) {
                photosOnPage[i].setAttribute("onclick", "MYAPP.images.toggleBigPhoto(this)");
            }

            localStorage.setItem("page", 1 + result.photos.page);
            MYAPP.images.loading = false;
    });
    
  }
}