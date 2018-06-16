// This is the js for the default/index.html view.


var app = function() {

    var self = {};

    Vue.config.silent = false; // show all warnings

    // Extends an array
    self.extend = function(a, b) {
        for (var i = 0; i < b.length; i++) {
            a.push(b[i]);
        }
    };

    // Enumerates an array.
    var enumerate = function(v) { var k=0; return v.map(function(e) {e._idx = k++;});};

    self.open_uploader = function () {
        $("div#uploader_div").show();
        self.vue.is_uploading = true;
    };

    self.close_uploader = function () {
        $("div#uploader_div").hide();
        self.vue.is_uploading = false;
        $("input#file_input").val(""); // This clears the file choice once uploaded.

    };

    self.upload_file = function (event) {
        // Reads the file.
        var input = $("input#file_input")[0];
        var file = input.files[0];
        //var price = $("input#price_input").[0];
        if (file) {
            // First, gets an upload URL.
            console.log("Trying to get the upload url");
            $.getJSON('https://upload-dot-luca-teaching.appspot.com/start/uploader/get_upload_url',
                function (data) {
                    // We now have upload (and download) URLs.
                    var put_url = data['signed_url'];
                    var get_url = data['access_url'];
                    console.log("Received upload url: " + put_url);
                    // Uploads the file, using the low-level interface.
                    var req = new XMLHttpRequest();
                    req.addEventListener("load", self.upload_complete(get_url,self.vue.input_price));
                    // TODO: if you like, add a listener for "error" to detect failure.
                    req.open("PUT", put_url, true);
                    req.send(file);
                });
        }
    };

    self.upload_complete = function(get_url, price) {
        // Hides the uploader div.
        self.close_uploader();
        console.log('The file was uploaded; it is now available at ' + get_url);
        // TODO: The file is uploaded.  Now you have to insert the get_url into the database, etc.
        $.post(add_image,
            {   
                image_url: get_url,
                price: price
            },
            function (data) {
                self.vue.user_images.push(data.user_images);
                enumerate(self.vue.user_images);
            })
    };

    function get_user_images_url(start_idx, end_idx, get_id) {
        var pp = {
            start_idx: start_idx,
            end_idx: end_idx,
            get_id: get_id,
        };
        return images_url + "?" + $.param(pp);
    }

    self.get_user_images = function (current_user) {
         console.log("Trying to get the user_images");
        $.getJSON(get_user_images_url(0, 20, current_user), function (data){
            self.vue.user_images = data.user_images;
            enumerate(self.vue.user_images);
        })
    };

    function get_users_url() {
        return user_url;
    }

    self.get_users = function (){
        $.getJSON(get_users_url(), function (data){
            self.vue.user_list=data.user_list;
            enumerate(self.vue.user_list);
            })
    };

    self.logged_in = function(){
        $.getJSON(function (data){
            self.vue.logged_in = data.logged_in;
        })
    };

    self.set_price = function(index){
        $.post(set_price,
            {
                get_id: self.vue.user_images[index].id,
                price: self.vue.user_images[index].price
            }, 
            function (data){
                self.vue.user_images[index].price = data.price;
            })
    };

    self.add_to_cart = function(index){
        image = self.vue.user_images[index];
        self.vue.cart_images.unshift(image);
        enumerate(self.vue.cart_images);
        image_id = self.vue.user_images[index].id;
        self.vue.cart_list.unshift(image_id);
        enumerate(self.vue.cart_list);
        self.total_price(index);
    };

    self.delete_from_cart = function(index){
        image_id = self.vue.user_images[index].id;
        for (var i = 0; i < self.vue.cart_list.length; i++){
            if (self.vue.cart_list[i] == image_id){
                self.vue.cart_list.splice(i,1);
                enumerate(self.vue.cart_list);
            }
        }
    };

    self.checkout = function(){
        self.vue.is_checkout = !self.vue.is_checkout;
    }

    self.total_price = function(index){
        price = self.vue.user_images[index].price;
        self.vue.total += price;
    };

    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            is_uploading: false,
            self_page: true, // Leave it to true, so initially you are looking at your own images.
            user_images: [],
            user_list: [],
            current_user: 0,
            input_price: 0,
            cart_list: [],
            cart_images: [],
            is_checkout: false,
            total: 0
        },
        methods: {
            open_uploader: self.open_uploader,
            close_uploader: self.close_uploader,
            upload_file: self.upload_file,
            get_user_images: self.get_user_images,
            set_price: self.set_price,
            add_to_cart: self.add_to_cart,
            delete_from_cart: self.delete_from_cart,
            checkout: self.checkout,
            total_price: self.total_price
        }

    });

    self.get_users();
    self.total_price();
    $("#vue-div").show();

    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});

