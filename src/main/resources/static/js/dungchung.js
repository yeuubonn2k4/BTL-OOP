var adminInfo = [{
    email: "admin@gmail.com",
    password: "adadad"
}];

function getListAdmin() {
    return JSON.parse(window.localStorage.getItem('ListAdmin'));
}

function setListAdmin(l) {
    window.localStorage.setItem('ListAdmin', JSON.stringify(l));
}


// Hàm khởi tạo, tất cả các trang đều cần
function khoiTao() {
    // get data từ localstorage
    list_products = getListProducts() || list_products;
    adminInfo = getListAdmin() || adminInfo;

    setupEventTaiKhoan();
    capNhat_ThongTin_CurrentUser();
    addEventCloseAlertButton();
}

// ========= Các hàm liên quan tới danh sách sản phẩm =========
// Localstorage cho dssp: 'ListProducts
function setListProducts(newList) {
    window.localStorage.setItem('ListProducts', JSON.stringify(newList));
}

function getListProducts() {
    return JSON.parse(window.localStorage.getItem('ListProducts'));
}

function timKiemTheoTen(list, ten, soluong) {
    var tempList = copyObject(list);
    var result = [];
    ten = ten.split(' ');

    for (var sp of tempList) {
        var correct = true;
        for (var t of ten) {
            if (sp.name.toUpperCase().indexOf(t.toUpperCase()) < 0) {
                correct = false;
                break;
            }
        }
        if (correct) {
            result.push(sp);
        }
    }

    return result;
}

function timKiemTheoMa(list, ma) {
    for (var l of list) {
        if (l.masp == ma) return l;
    }
}

// copy 1 object, do trong js ko có tham biến , tham trị rõ ràng
// nên dùng bản copy để chắc chắn ko ảnh hưởng tới bản chính
function copyObject(o) {
    return JSON.parse(JSON.stringify(o));
}

// ============== ALert Box ===============
// div có id alert được tạo trong hàm addFooter
function addAlertBox(text, bgcolor, textcolor, time) {
    var al = document.getElementById('alert');
    al.childNodes[0].nodeValue = text;
    al.style.backgroundColor = bgcolor;
    al.style.opacity = 1;
    al.style.zIndex = 200;

    if (textcolor) al.style.color = textcolor;
    if (time)
        setTimeout(function () {
            al.style.opacity = 0;
            al.style.zIndex = 0;
        }, time);
}

function addEventCloseAlertButton() {
    document.getElementById('closebtn')
        .addEventListener('mouseover', (event) => {
            // event.target.parentElement.style.display = "none";
            event.target.parentElement.style.opacity = 0;
            event.target.parentElement.style.zIndex = 0;
        });
}

// ================ Cart Number + Thêm vào Giỏ hàng ======================
function animateCartNumber() {
    // Hiệu ứng cho icon giỏ hàng
    var cn = document.getElementsByClassName('cart-number')[0];
    cn.style.transform = 'scale(2)';
    cn.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
    cn.style.color = 'white';
    setTimeout(function () {
        cn.style.transform = 'scale(1)';
        cn.style.backgroundColor = 'transparent';
        cn.style.color = 'red';
    }, 1200);
}

function themVaoGioHang(masp, tensp) {
    var user = getCurrentUser();
    if (!user) {
        alert('Bạn cần đăng nhập để mua hàng !');
        showTaiKhoan(true);
        return;
    }
    if (user.off) {
        alert('Tài khoản của bạn hiện đang bị khóa nên không thể mua hàng!');
        addAlertBox('Tài khoản của bạn đã bị khóa bởi Admin.', '#aa0000', '#fff', 10000);
        return;
    }
    var t = new Date();
    var daCoSanPham = false;;

    for (var i = 0; i < user.products.length; i++) { // check trùng sản phẩm
        if (user.products[i].ma == masp) {
            user.products[i].soluong++;
            daCoSanPham = true;
            break;
        }
    }

    if (!daCoSanPham) { // nếu không trùng thì mới thêm sản phẩm vào user.products
        user.products.push({
            "ma": masp,
            "soluong": 1,
            "date": t
        });
    }

    animateCartNumber();
    addAlertBox('Đã thêm ' + tensp + ' vào giỏ.', '#17c671', '#fff', 3500);

    setCurrentUser(user); // cập nhật giỏ hàng cho user hiện tại
    updateListUser(user); // cập nhật list user
    capNhat_ThongTin_CurrentUser(); // cập nhật giỏ hàng
}

// ============================== TÀI KHOẢN ============================

// Hàm get set cho người dùng hiện tại đã đăng nhập
function getCurrentUser() {
    const currentUser = JSON.parse(localStorage.getItem('CurrentUser'));

    // Check if currentUser and token are available
    if (currentUser && currentUser.token) {
        const token = currentUser.token;

        // Step 2: Decode the JWT token
        function decodeJWT(token) {
            // Split the token into its parts
            const parts = token.split('.');

            // Check if the token has 3 parts (header, payload, signature)
            if (parts.length !== 3) {
                throw new Error('Invalid JWT token');
            }

            // Decode the base64 URL encoded parts
            const decodeBase64Url = (base64Url) => {
                let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                while (base64.length % 4) {
                    base64 += '=';
                }
                return atob(base64);
            };

            // Decode header and payload
            const header = JSON.parse(decodeBase64Url(parts[0]));
            const payload = JSON.parse(decodeBase64Url(parts[1]));

            return {
                header: header,
                payload: payload
            };
        }

        // Decode the token and log the payload
        const decoded = decodeJWT(token);
        console.log(decoded.payload);  // Log the decoded payload
        return decoded.payload;

    } else {
        console.log('No user or token found in localStorage');
    }

    // return currentUser;

    // console.log(window.localStorage.getItem('CurrentUser').token);
    // return JSON.parse(window.localStorage.getItem('CurrentUser')); // Lấy dữ liệu từ localstorage
}

function setCurrentUser(u) {
    window.localStorage.setItem('CurrentUser', JSON.stringify(u));
}

// Hàm get set cho danh sách người dùng
function getListUser() {
    var data = JSON.parse(window.localStorage.getItem('ListUser')) || []
    var l = [];
    for (var d of data) {
        l.push(d);
    }
    return l;
}

function setListUser(l) {
    window.localStorage.setItem('ListUser', JSON.stringify(l));
}

// Sau khi chỉnh sửa 1 user 'u' thì cần hàm này để cập nhật lại vào ListUser
function updateListUser(u, newData) {
    var list = getListUser();
    for (var i = 0; i < list.length; i++) {
        if (equalUser(u, list[i])) {
            list[i] = (newData ? newData : u);
        }
    }
    setListUser(list);
}

function logIn(event) {
    event.preventDefault();

    // Get the form element
    var form = event.target;

    // Get data from the form
    var getEmail = form.email.value; // Tên đăng nhập
    var getPass = form.pass.value; // Mật khẩu

    alert("email " + getEmail + "Pass: " + getPass);

    // Create user object
    var newUser = {
        email: getEmail, // Key must match the backend's expected field names
        password: getPass  // Key must match the backend's expected field names
    };

    // Đăng nhập vào admin
    for (var ad of adminInfo) {
        if (equalUser(newUser, ad)) {
            alert('Xin chào admin .. ');
            window.localStorage.setItem('admin', true);
            window.location.assign('admin.html');
            return false;
        }
    }

    // Send POST request to API
    $.ajax({
        url: 'http://localhost:8088/shop/api/v1/auth/login',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(newUser), // Convert object to JSON string
        success: function(response) {
            alert('Đăng nhập thành công');
            setCurrentUser(response.data);

            // Reload lại trang -> sau khi reload sẽ cập nhật luôn giỏ hàng khi hàm setupEventTaiKhoan chạy
            location.reload();
            return false;
        },
        error: function(xhr, status, error) {
            var errorMessage = xhr.responseJSON ? xhr.responseJSON.message : 'Có lỗi xảy ra!';
            alert(errorMessage); // Display error message from backend
        }
    });

    // // Lấy dữ liệu từ danh sách người dùng localstorage
    // var listUser = getListUser();
    //
    // // Kiểm tra xem dữ liệu form có khớp với người dùng nào trong danh sách ko
    // for (var u of listUser) {
    //     if (equalUser(newUser, u)) {
    //         if(u.off) {
    //             alert('Tài khoản này đang bị khoá. Không thể đăng nhập.');
    //             return false;
    //         }
    //
    //         setCurrentUser(u);
    //
    //         // Reload lại trang -> sau khi reload sẽ cập nhật luôn giỏ hàng khi hàm setupEventTaiKhoan chạy
    //         location.reload();
    //         return false;
    //     }
    // }
    //

    // Trả về thông báo nếu không khớp
    alert('Nhập sai tên hoặc mật khẩu !!!');
    form.username.focus();
    return false;
}
function signUp(event) {
    event.preventDefault(); // Prevent the form from submitting the default way

    // Get the form element
    var form = event.target;

    // Collect form data
    var ho = form.lastName.value; // Họ
    var ten = form.firstName.value; // Tên
    var email = form.email.value; // Địa chỉ email
    var username = form.userName.value; // Tên đăng nhập
    var pass = form.password.value; // Mật khẩu

    // Create user object
    var newUser = {
        lastName: ho,
        firstName: ten,
        userName: username,
        email: email,
        password: pass
    };

    // Send POST request to API
    $.ajax({
        url: 'http://localhost:8088/shop/api/v1/users/add',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(newUser),
        success: function(response) {
            alert('Đăng kí thành công, Bạn sẽ được tự động đăng nhập!');
            location.reload(); // Reload the page
        },
        error: function(xhr, status, error) {
            var errorMessage = xhr.responseJSON ? xhr.responseJSON.message : 'Có lỗi xảy ra!';
            alert(errorMessage); // Display error message from backend
        }
    });

    return false; // Prevent default form submission explicitly as a safeguard
}

//function signUp(form) {
//    var ho = form.ho.value;
//    var ten = form.ten.value;
//    var email = form.email.value;
//    var username = form.newUser.value;
//    var pass = form.newPass.value;
//    var newUser = new User(username, pass, ho, ten, email);
//
//    // Lấy dữ liệu các khách hàng hiện có
//    var listUser = getListUser();
//
//    // Kiểm tra trùng admin
//    for (var ad of adminInfo) {
//        if (newUser.username == ad.username) {
//            alert('Tên đăng nhập đã có người sử dụng !!');
//            return false;
//        }
//    }
//
//    // Kiểm tra xem dữ liệu form có trùng với khách hàng đã có không
//    for (var u of listUser) {
//        if (newUser.username == u.username) {
//            alert('Tên đăng nhập đã có người sử dụng !!');
//            return false;
//        }
//    }
//
//    // Lưu người mới vào localstorage
//    listUser.push(newUser);
//    window.localStorage.setItem('ListUser', JSON.stringify(listUser));
//
//    // Đăng nhập vào tài khoản mới tạo
//    window.localStorage.setItem('CurrentUser', JSON.stringify(newUser));
//    alert('Đăng kí thành công, Bạn sẽ được tự động đăng nhập!');
//    location.reload();
//
//    return false;
//}

function logOut() {
    window.localStorage.removeItem('CurrentUser');
    location.reload();
}

// Hiển thị form tài khoản, giá trị truyền vào là true hoặc false
function showTaiKhoan(show) {
    var value = (show ? "scale(1)" : "scale(0)");
    var div = document.getElementsByClassName('containTaikhoan')[0];
    div.style.transform = value;
}

// Check xem có ai đăng nhập hay chưa (CurrentUser có hay chưa)
// Hàm này chạy khi ấn vào nút tài khoản trên header
function checkTaiKhoan() {
    if (!getCurrentUser()) {
        showTaiKhoan(true);
    }
}

function checkTaiKhoan2() {
    const currentUser = getCurrentUser(); // Get the current user from localStorage
    const taiKhoanText = document.getElementById('taiKhoanText');
    const menuMember = document.getElementById('menuMember');

    if (currentUser) {
        // If user is logged in, update the link text to display username
        const taiKhoanText = document.getElementById('taiKhoanText');
        taiKhoanText.textContent = `Xin chào, ${currentUser.sub || currentUser.sub || 'User'}`;

        // Show the dropdown menu when clicked
        menuMember.classList.remove('hide');
    } else {
        // If no user is logged in, keep the original "Tài khoản" text
        // const taiKhoanText = document.getElementById('taiKhoanText');
        // taiKhoanText.textContent = 'Tài khoản';
        // Reset the text and hide the dropdown menu
        taiKhoanText.textContent = 'Tài khoản';
        menuMember.classList.add('hide');
    }
}

// Run this function on page load
document.addEventListener('DOMContentLoaded', function () {
    checkTaiKhoan2();  // Update the account link based on login status
});

// Toggle the display of the member menu
function toggleMemberMenu() {
    const menuMember = document.getElementById('menuMember');
    menuMember.classList.toggle('hide');
}

// Log the user out
function logOut() {
    // Clear the user from localStorage
    localStorage.removeItem('CurrentUser');

    // Optionally redirect to the login page
    alert('Đăng xuất thành công!');
    location.reload();
}

// Tạo event, hiệu ứng cho form tài khoản
function setupEventTaiKhoan() {
    var taikhoan = document.getElementsByClassName('taikhoan')[0];
    var list = taikhoan.getElementsByTagName('input');

    // Tạo eventlistener cho input để tạo hiệu ứng label
    // Gồm 2 event onblur, onfocus được áp dụng cho từng input trong list bên trên
    ['blur', 'focus'].forEach(function (evt) {
        for (var i = 0; i < list.length; i++) {
            list[i].addEventListener(evt, function (e) {
                var label = this.previousElementSibling; // lấy element ĐỨNG TRƯỚC this, this ở đây là input
                if (e.type === 'blur') { // khi ấn chuột ra ngoài
                    if (this.value === '') { // không có value trong input thì đưa label lại như cũ
                        label.classList.remove('active');
                        label.classList.remove('highlight');
                    } else { // nếu có chữ thì chỉ tắt hightlight chứ không tắt active, active là dịch chuyển lên trên
                        label.classList.remove('highlight');
                    }
                } else if (e.type === 'focus') { // khi focus thì label active + hightlight
                    label.classList.add('active');
                    label.classList.add('highlight');
                }
            });
        }
    })

    // Event chuyển tab login-signup
    var tab = document.getElementsByClassName('tab');
    for (var i = 0; i < tab.length; i++) {
        var a = tab[i].getElementsByTagName('a')[0];
        a.addEventListener('click', function (e) {
            e.preventDefault(); // tắt event mặc định

            // Thêm active(màu xanh lá) cho li chứa tag a này => ấn login thì login xanh, signup thì signup sẽ xanh
            this.parentElement.classList.add('active');

            // Sau khi active login thì phải tắt active sigup và ngược lại
            // Trường hợp a này thuộc login => <li>Login</li> sẽ có nextElement là <li>SignUp</li>
            if (this.parentElement.nextElementSibling) {
                this.parentElement.nextElementSibling.classList.remove('active');
            }
            // Trường hợp a này thuộc signup => <li>SignUp</li> sẽ có .previousElement là <li>Login</li>
            if (this.parentElement.previousElementSibling) {
                this.parentElement.previousElementSibling.classList.remove('active');
            }

            // Ẩn phần nhập của login nếu ấn signup và ngược lại
            // href của 2 tab signup và login là #signup và #login -> tiện cho việc getElement dưới đây
            var target = this.href.split('#')[1];
            document.getElementById(target).style.display = 'block';

            var hide = (target == 'login' ? 'signup' : 'login');
            document.getElementById(hide).style.display = 'none';
        })
    }

    // Đoạn code tạo event trên được chuyển về js thuần từ code jquery
    // Code jquery cho phần tài khoản được lưu ở cuối file này
}

// Cập nhật số lượng hàng trong giỏ hàng + Tên current user
function capNhat_ThongTin_CurrentUser() {
    var u = getCurrentUser();
    if (u) {
        // Cập nhật số lượng hàng vào header
        document.getElementsByClassName('cart-number')[0].innerHTML = getTongSoLuongSanPhamTrongGioHang(u);
        // Cập nhật tên người dùng
        document.getElementsByClassName('member')[0]
            .getElementsByTagName('a')[0].childNodes[2].nodeValue = ' ' + u.username;
        // bỏ class hide của menu người dùng
        document.getElementsByClassName('menuMember')[0]
            .classList.remove('hide');
    }
}

// tính tổng số lượng các sản phẩm của user u truyền vào
function getTongSoLuongSanPhamTrongGioHang(u) {
    var soluong = 0;
    for (var p of u.products) {
        soluong += p.soluong;
    }
    return soluong;
}

// lấy số lương của sản phẩm NÀO ĐÓ của user NÀO ĐÓ được truyền vào
function getSoLuongSanPhamTrongUser(tenSanPham, user) {
    for (var p of user.products) {
        if (p.name == tenSanPham)
            return p.soluong;
    }
    return 0;
}

// ==================== Những hàm khác ===================== 
function numToString(num, char) {
    return num.toLocaleString().split(',').join(char || '.');
}

function stringToNum(str, char) {
    return Number(str.split(char || '.').join(''));
}

// https://www.w3schools.com/howto/howto_js_autocomplete.asp
function autocomplete(inp, arr) {
    var currentFocus;

    inp.addEventListener("keyup", function (e) {
        if (e.keyCode != 13 && e.keyCode != 40 && e.keyCode != 38) { // not Enter,Up,Down arrow
            var a, b, i, val = this.value;

            /*close any already open lists of autocompleted values*/
            closeAllLists();
            if (!val) {
                return false;
            }
            currentFocus = -1;

            /*create a DIV element that will contain the items (values):*/
            a = document.createElement("DIV");
            a.setAttribute("id", this.id + "autocomplete-list");
            a.setAttribute("class", "autocomplete-items");

            /*append the DIV element as a child of the autocomplete container:*/
            this.parentNode.appendChild(a);

            /*for each item in the array...*/
            for (i = 0; i < arr.length; i++) {
                /*check if the item starts with the same letters as the text field value:*/
                if (arr[i].name.substr(0, val.length).toUpperCase() == val.toUpperCase()) {

                    /*create a DIV element for each matching element:*/
                    b = document.createElement("DIV");

                    /*make the matching letters bold:*/
                    b.innerHTML = "<strong>" + arr[i].name.substr(0, val.length) + "</strong>";
                    b.innerHTML += arr[i].name.substr(val.length);

                    /*insert a input field that will hold the current array item's value:*/
                    b.innerHTML += "<input type='hidden' value='" + arr[i].name + "'>";

                    /*execute a function when someone clicks on the item value (DIV element):*/
                    b.addEventListener("click", function (e) {
                        /*insert the value for the autocomplete text field:*/
                        inp.value = this.getElementsByTagName("input")[0].value;
                        inp.focus();

                        /*close the list of autocompleted values,
                        (or any other open lists of autocompleted values:*/
                        closeAllLists();
                    });
                    a.appendChild(b);
                }
            }
        }

    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed, increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/

            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) {
                    x[currentFocus].click();
                    e.preventDefault();
                }
            }
        }
    });

    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }

    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }

    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document, except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}

// Thêm từ khóa tìm kiếm
function addTags(nameTag, link) {
    var new_tag = `<a href=` + link + `>` + nameTag + `</a>`;

    // Thêm <a> vừa tạo vào khung tìm kiếm
    var khung_tags = document.getElementsByClassName('tags')[0];
    khung_tags.innerHTML += new_tag;
}

// Thêm sản phẩm vào trang
function addProduct(p, ele, returnString) {
	promo = new Promo(p.promo.name, p.promo.value); // class Promo
	product = new Product(p.masp, p.name, p.img, p.price, p.star, p.rateCount, promo); // Class product

	return addToWeb(product, ele, returnString);
}

// Thêm topnav vào trang
function addTopNav() {
    document.write(`    
	<div class="top-nav group">
        <section>
            <div class="social-top-nav">
                <a class="fa fa-facebook"></a>
                <a class="fa fa-twitter"></a>
                <a class="fa fa-google"></a>
                <a class="fa fa-youtube"></a>
            </div> <!-- End Social Topnav -->

            <ul class="top-nav-quicklink flexContain">
                <li><a href="index"><i class="fa fa-home"></i> Trang chủ</a></li>
                <li><a href="tintuc"><i class="fa fa-newspaper-o"></i> Tin tức</a></li>
                <li><a href="tuyendung"><i class="fa fa-handshake-o"></i> Tuyển dụng</a></li>
                <li><a href="gioithieu"><i class="fa fa-info-circle"></i> Giới thiệu</a></li>
                <li><a href="trungtambaohanh"><i class="fa fa-wrench"></i> Bảo hành</a></li>
                <li><a href="lienhe"><i class="fa fa-phone"></i> Liên hệ</a></li>
            </ul> <!-- End Quick link -->
        </section><!-- End Section -->
    </div><!-- End Top Nav  -->`);
}

// Thêm header
function addHeader() {
    document.write(`        
	<div class="header group">
        <div class="logo">
            <a href="index">
                <img src="https://intriphat.com/wp-content/uploads/2024/04/logo-cua-hang-dien-thoai-10.jpg" height: 300px;width: 300px; alt="Trang chủ CITYMOBILE" title="Trang chủ CITYMOBILE">
            </a>
        </div> <!-- End Logo -->

        <div class="content">
            <div class="search-header" style="position: relative; left: 162px; top: 1px;">
                <form class="input-search" method="get" action="index.html">
                    <div class="autocomplete">
                        <input id="search-box" name="search" autocomplete="off" type="text" placeholder="Nhập từ khóa tìm kiếm...">
                        <button type="submit">
                            <i class="fa fa-search"></i>
                            Tìm kiếm
                        </button>
                    </div>
                </form> <!-- End Form search -->
                <div class="tags">
                    <strong>Từ khóa: </strong>
                </div>
            </div> <!-- End Search header -->

            <div class="tools-member">
                <div class="member">
                    <a onclick="checkTaiKhoan()">
                        <i class="fa fa-user"></i>
                        Tài khoản
                    </a>
                    <div class="menuMember hide">
                        <a href="nguoidung">Trang người dùng</a>
                        <a onclick="if(window.confirm('Xác nhận đăng xuất ?')) logOut();">Đăng xuất</a>
                    </div>

                </div> <!-- End Member -->

                <div class="cart">
                    <a href="giohang">
                        <i class="fa fa-shopping-cart"></i>
                        <span>Giỏ hàng</span>
                        <span class="cart-number"></span>
                    </a>
                </div> <!-- End Cart -->

                <!--<div class="check-order">
                    <a>
                        <i class="fa fa-truck"></i>
                        <span>Đơn hàng</span>
                    </a>
                </div> -->
            </div><!-- End Tools Member -->
        </div> <!-- End Content -->
    </div> <!-- End Header -->`)
}

function addFooter() {
    document.write(`
    <!-- ============== Alert Box ============= -->
    <div id="alert">
        <span id="closebtn">&otimes;</span>
    </div>

    <!-- ============== Footer ============= -->
    <div class="copy-right">
        <p><a href="index">LDD Phone Store</a> - All rights reserved © 2021 - Designed by
            <span style="color: #eee; font-weight: bold">group 15th</span></p>
    </div>`);
}

// Thêm contain Taikhoan
function addContainTaiKhoan() {
    document.write(`
	<div class="containTaikhoan">
        <span class="close" onclick="showTaiKhoan(false);">&times;</span>
        <div class="taikhoan">

            <ul class="tab-group">
                <li class="tab active"><a href="#login">Đăng nhập</a></li>
                <li class="tab"><a href="#signup">Đăng kí</a></li>
            </ul> <!-- /tab group -->

            <div class="tab-content">
                <div id="login">
                    <h1>Chào mừng bạn trở lại!</h1>

                    <form onsubmit="return logIn(event);">

                        <div class="field-wrap">
                            <label>
                                Email: <span class="req">*</span>
                            </label>
                            <input name='email' type="email" required autocomplete="off" />
                        </div> <!-- /email -->

                        <div class="field-wrap">
                            <label>
                                Mật khẩu<span class="req">*</span>
                            </label>
                            <input name="pass" type="password" required autocomplete="off" />
                        </div> <!-- pass -->

                        <p class="forgot">
                            <a href="#" onclick="login()">Quên mật khẩu?</a>
                        </p>

                        <button type="submit" class="button button-block" />Tiếp tục</button>

                    </form> <!-- /form -->

                </div> <!-- /log in -->

                <div id="signup">
                    <h1>Đăng kí miễn phí</h1>

                    <form onsubmit="return signUp(event);">

                        <div class="top-row">
                            <div class="field-wrap">
                                <label>
                                    Họ<span class="req">*</span>
                                </label>
                                <input name="lastName" type="text" required autocomplete="off" />
                            </div>

                            <div class="field-wrap">
                                <label>
                                    Tên<span class="req">*</span>
                                </label>
                                <input name="firstName" type="text" required autocomplete="off" />
                            </div>
                        </div> <!-- / ho ten -->

                        <div class="field-wrap">
                            <label>
                                Địa chỉ Email<span class="req">*</span>
                            </label>
                            <input name="email" type="email" required autocomplete="off" />
                        </div> <!-- /email -->

                        <div class="field-wrap">
                            <label>
                                Tên đăng nhập<span class="req">*</span>
                            </label>
                            <input name="userName" type="text" required autocomplete="off" />
                        </div> <!-- /user name -->

                        <div class="field-wrap">
                            <label>
                                Mật khẩu<span class="req">*</span>
                            </label>
                            <input name="password" type="password" required autocomplete="off" />
                        </div> <!-- /pass -->

                        <button type="submit" class="button button-block" />Tạo tài khoản</button>

                    </form> <!-- /form -->

                </div> <!-- /sign up -->
            </div><!-- tab-content -->

        </div> <!-- /taikhoan -->

        <!-- Forgot Password Popup Structure -->
        <div class="overlay" id="forgotPasswordOverlay" hidden>
            <div class="forgot-password-modal" id="emailForm">
                <h2>Quên mật khẩu</h2>
                <p>Vui lòng nhập địa chỉ email của bạn để nhận mã xác nhận.</p>
                <div class="input-field">
                    <label for="forgotEmail">Email*</label>
                    <input type="email" id="forgotEmail" name="forgotEmail" placeholder="Nhập email của bạn">
                </div>
                <button class="button" onclick="sendVerificationCode()">GỬI MÃ XÁC NHẬN</button>
                <div class="back-to-login">
                    <a onclick="closeForgotPasswordPopup()">Trở về đăng nhập</a>
                </div>
            </div>
    
            <!-- Verification Code Form -->
            <div class="forgot-password-modal" id="codeForm" style="display: none;">
                <h2>Xác nhận mã</h2>
                <p>Vui lòng nhập mã xác nhận đã được gửi tới email của bạn.</p>
                <div class="input-field">
                    <label for="verificationCode">Mã xác nhận*</label>
                    <input type="text" id="verificationCode" name="verificationCode" placeholder="Nhập mã xác nhận">
                </div>
                <button class="button" onclick="verifyCode()">XÁC NHẬN MÃ</button>
                <div class="back-to-login">
                    <a onclick="closeForgotPasswordPopup()">Trở về đăng nhập</a>
                </div>
            </div>
    
             <!-- reset password Form -->
            <div class="forgot-password-modal" id="resetPasswordForm" style="display: none;">
                <h2>Đặt lại mật khẩu mới</h2>
                <div class="input-field">
                    <label for="newPassword">Mật khẩu mới</label>
                    <input type="password" id="newPassword" name="newPassword">
                </div>
                <div class="input-field">
                    <label for="verifyNewPassword">Xác nhận mật khẩu mới</label>
                    <input type="password" id="verifyNewPassword" name="verifyNewPassword">
                </div>
                <button class="button" onclick="resetPassword()">ĐẶT LẠI MẬT KHẨU</button>
            </div>
        </div>

    </div>`);
}
// Thêm plc (phần giới thiệu trước footer)
function addPlc() {
    document.write(`
    <div class="plc">
        <section>
            <ul class="flexContain">
                <li>Giao hàng hỏa tốc trong 1 giờ</li>
                <li>Thanh toán linh hoạt: tiền mặt, visa / master, trả góp</li>
                <li>Trải nghiệm sản phẩm tại nhà</li>
                <li>Lỗi đổi tại nhà trong 1 ngày</li>
                <li>Hỗ trợ suốt thời gian sử dụng.
                    <br>Hotline:
                    <a href="tel:12345678" style="color: #288ad6;">12345678</a>
                </li>
            </ul>
        </section>
    </div>`);
}

document.addEventListener("DOMContentLoaded", function () {
    const tabs = document.querySelectorAll(".tab");
    const tabContents = document.querySelectorAll(".tab-content > div");

    tabs.forEach((tab, index) => {
        tab.addEventListener("click", function (e) {
            e.preventDefault();

            // Remove active class from all tabs and hide all content
            tabs.forEach((t) => t.classList.remove("active"));
            tabContents.forEach((content) => (content.style.display = "none"));

            // Add active class to the clicked tab and show the corresponding content
            tab.classList.add("active");
            tabContents[index].style.display = "block";
        });
    });

    // Show the login tab by default
    tabContents[0].style.display = "block";
});

function login() {
    alert("Login to page")
}

function openForgotPasswordPopup() {
    alert("LMAOOoo")
    // document.getElementById('forgotPasswordOverlay').classList.add('show');
    document.getElementById('forgotPasswordOverlay').hidden = false;
    document.getElementById('emailForm').style.display = 'block';
    document.getElementById('codeForm').style.display = 'none';
    document.getElementById('resetPasswordForm').style.display = 'none';
}

 // Function to close the Forgot Password popup
 function closeForgotPasswordPopup() {
    document.getElementById('forgotPasswordOverlay').hidden = true;
}

// Function to simulate sending a verification code
function sendVerificationCode() {
    const email = document.getElementById('forgotEmail').value;
    alert("Mã xác nhận đã được gửi đến " + email);
    document.getElementById('emailForm').style.display = 'none';
    document.getElementById('codeForm').style.display = 'block';
    if (email) {
        alert("Mã xác nhận đã được gửi đến " + email);
        document.getElementById('emailForm').style.display = 'none';
        document.getElementById('codeForm').style.display = 'block';
    } else {
        alert("Vui lòng nhập địa chỉ email hợp lệ.");
    }
}

// Function to simulate verifying the code
function verifyCode() {
    const code = document.getElementById('verificationCode').value;
    if (code === "123456") { // Simulated verification code
        alert("Mã xác nhận hợp lệ. Bạn có thể đặt lại mật khẩu.");
        document.getElementById('codeForm').style.display = 'none';
        document.getElementById('resetPasswordForm').style.display = 'block';
    } else {
        alert("Mã xác nhận không đúng. Vui lòng thử lại.");
    }
}

function resetPassword() {
    const newPassword = document.getElementById('newPassword').value;
    const verifyNewPassword = document.getElementById('verifyNewPassword').value;

    if (newPassword !== verifyNewPassword) {
        alert("Mật khẩu không đúng. Vui lòng thử lại.");
    } else {
        alert("Đổi mật khẩu thành công!");
        closeForgotPasswordPopup();
    }
}

// https://stackoverflow.com/a/2450976/11898496
function shuffleArray(array) {
    let currentIndex = array.length,  randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
}

function checkLocalStorage() {
    if (typeof (Storage) == "undefined") {
        alert('Máy tính không hỗ trợ LocalStorage. Không thể lưu thông tin sản phẩm, khách hàng!!');
    } else {
        console.log('LocaStorage OKE!');
    }
}

// Di chuyển lên đầu trang
function gotoTop() {
    if (window.jQuery) {
        jQuery('html,body').animate({
            scrollTop: 0
        }, 100);
    } else {
        document.getElementsByClassName('top-nav')[0].scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    }
}

// Lấy màu ngẫu nhiên
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Test, not finished
function auto_Get_Database() {
    var ul = document.getElementsByClassName('homeproduct')[0];
    var li = ul.getElementsByTagName('li');
    for (var l of li) {
        var a = l.getElementsByTagName('a')[0];
        // name
        var name = a.getElementsByTagName('h3')[0].innerHTML;

        // price
        var price = a.getElementsByClassName('price')[0]
        price = price.getElementsByTagName('strong')[0].innerHTML;

        // img
        var img = a.getElementsByTagName('img')[0].src;
        console.log(img);

        // // rating
        // var rating = a.getElementsByClassName('ratingresult')[0];
        // var star = rating.getElementsByClassName('icontgdd-ystar').length;
        // var rateCount = parseInt(rating.getElementsByTagName('span')[0].innerHTML);

        // // promo
        // var tragop = a.getElementsByClassName('installment');
        // if(tragop.length) {

        // }

        // var giamgia = a.getElementsByClassName('discount').length;
        // var giareonline = a.getElementsByClassName('shockprice').length;
    }
}

function getThongTinSanPhamFrom_TheGioiDiDong() {
    javascript: (function () {
        var s = document.createElement('script');
        s.innerHTML = `
			(function () {
				var ul = document.getElementsByClassName('parameter')[0];
				var li_s = ul.getElementsByTagName('li');
				var result = {};
				result.detail = {};
	
				for (var li of li_s) {
					var loai = li.getElementsByTagName('span')[0].innerText;
					var giatri = li.getElementsByTagName('div')[0].innerText;
	
					switch (loai) {
						case "Màn hình:":
							result.detail.screen = giatri.replace('"', "'");
							break;
						case "Hệ điều hành:":
							result.detail.os = giatri;
							break;
						case "Camera sau:":
							result.detail.camara = giatri;
							break;
						case "Camera trước:":
							result.detail.camaraFront = giatri;
							break;
						case "CPU:":
							result.detail.cpu = giatri;
							break;
						case "RAM:":
							result.detail.ram = giatri;
							break;
						case "Bộ nhớ trong:":
							result.detail.rom = giatri;
							break;
						case "Thẻ nhớ:":
							result.detail.microUSB = giatri;
							break;
						case "Dung lượng pin:":
							result.detail.battery = giatri;
							break;
					}
				}
	
				console.log(JSON.stringify(result, null, "\t"));
			})();`;
        document.body.appendChild(s);
    })();
}

// $('.taikhoan').find('input').on('keyup blur focus', function (e) {

//     var $this = $(this),
//         label = $this.prev('label');

//     if (e.type === 'keyup') {
//         if ($this.val() === '') {
//             label.removeClass('active highlight');
//         } else {
//             label.addClass('active highlight');
//         }
//     } else if (e.type === 'blur') {
//         if ($this.val() === '') {
//             label.removeClass('active highlight');
//         } else {
//             label.removeClass('highlight');
//         }
//     } else if (e.type === 'focus') {

//         if ($this.val() === '') {
//             label.removeClass('highlight');
//         } else if ($this.val() !== '') {
//             label.addClass('highlight');
//         }
//     }

// });

// $('.tab a').on('click', function (e) {

//     e.preventDefault();

//     $(this).parent().addClass('active');
//     $(this).parent().siblings().removeClass('active');

//     target = $(this).attr('href');

//     $('.tab-content > div').not(target).hide();

//     $(target).fadeIn(600);

// });
