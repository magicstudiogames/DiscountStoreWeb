document.addEventListener("DOMContentLoaded", function () {
    var pathname = window.location.pathname;

    function onLoading() {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user != null) {
                if (pathname == "/") {
                    window.location.replace("/main/");
                }
                var name = user.displayName;
                var email = user.email;
                var verified = user.emailVerified;
                var photo = user.photoURL;
                var uid = user.uid;
                onLoadingData(name, email, verified, photo, uid);
                fetchCardsFromDatabase();
            } else {
                if (pathname == "/main/") {
                    window.location.replace("/");
                }
            }
        });
    }

    function onLoadingData(name, email, verified, photo, uid) {
        document.getElementById("profile_name").innerText = name;
    }

    function fetchCardsFromDatabase() {
        firebase.database().ref("cards").orderByChild("balance").on("child_added", function (snapshot) {
            var cardData = snapshot.val();
            createCardElement(cardData);
        });

    }

    function createCardElement(cardData) {
        var cardListElement = document.getElementById("card_list");

        var balance = cardData.balance;
        var description = cardData.description;
        var title = cardData.title;

        var root = document.createElement("div");
        root.className = "col-6 col-sm-6 col-md-6 col-lg-4";

        var card = document.createElement("div");
        card.className = "card mb-2 mt-2 rounded-3 shadow-sm";


        var image = document.createElement("img");
        image.className = "card-img-top";
        image.src = "https://images.pexels.com/photos/36717/amazing-animal-beautiful-beautifull.jpg?cs=srgb&dl=pexels-pixabay-36717.jpg&fm=jpg";

        var body = document.createElement("div");
        body.className = "card-body";

        var ElementTitle = document.createElement("h6");
        ElementTitle.className = "card-title text-start";
        ElementTitle.innerText = title + "\n" + getBRL(balance);

        var ElementDescription = document.createElement("p");
        ElementDescription.className = "card-text text-start";
        ElementDescription.innerText = description;

        card.appendChild(image);
        card.appendChild(body);
        body.appendChild(ElementTitle);
        body.appendChild(ElementDescription);

        root.appendChild(card);
        cardListElement.appendChild(root);
    }

    function getBRL(IN) {
        var OUT = (IN / 1000).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
        return OUT;
    }

    $("#sign_in").click(function () {
        var email = document.getElementById("email").value;
        var password = document.getElementById("password").value;
        if (email.length == 0) {
            alert("Por favor insira um endereço de e-mail.");
            return;
        } else if (password.length == 0) {
            alert("Por favor insira uma senha.");
            return;
        } else {
            firebase.auth().signInWithEmailAndPassword(email, password).then(function (userCredential) {
                var user = userCredential.user;
                if (user != null) {
                    onLoading();
                }
            }).catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                if (errorCode === "auth/wrong-password") {
                    alert("Senha incorreta.");
                } else if (errorCode === "auth/user-not-found") {
                    alert("Usuário não registrado.");
                } else {
                    alert(errorMessage);
                }
                alert(error);
                document.getElementById("sign_in").disabled = false;
            });
            document.getElementById("sign_in").disabled = true;
        }
    });

    $("#sign_out").click(function () {
        firebase.auth().signOut().then(function () {
            if (pathname == "/main/") {
                window.location.reload();
            }
        }).catch(function (error) {});
    });

    // Initialization
    onLoading();
});
