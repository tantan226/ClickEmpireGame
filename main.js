const config = {
    loginPage:document.getElementById("login-page"),
    mainPage:document.getElementById("main-page"),
    itemPage:null,
}
class Player{
    constructor(name,day,age,money,bugers,oneClick,income,items,stock,bond){
        this.name = name;
        this.day = day;
        this.age = age;
        this.money = money;
        this.bugers = bugers;
        this.oneClick = oneClick;
        this.income = income;
        this.items = items;
        this.stock = stock;
        this.bond = bond;
    }


    clickHumbuger(){
        this.money += this.oneClick;
        this.bugers ++;
    }

    incomePerSecond(){
        this.money += this.income;
        Update.money(this);
    }
    
    advanceDay(){
        this.day += 1;
        Update.day(this);
        if(this.old()){
            this.age+=1;
            Update.age(this);
        }
    }
    old(){
        return this.day % 365 == 0;
    }
    divident(){
        this.money = this.money + (this.stock * 0.001) + (this.bond * 0.0007);
    }
    save(){
        let data = JSON.stringify(this);
        localStorage.setItem(this.name,data);
        alert("保存しました");
    }
}
class Item {
    constructor(name, type, price, posessions, income,maxPurchases,imgUrl,discription,id){
        this.name = name;
        this.type = type;
        this.price = price;
        this.posessions = posessions;
        this.income = income;
        this.maxPurchases = maxPurchases;
        this.imgUrl =  imgUrl;
        this.discription = discription;
        this.id = id;
        this.assets = 0;
    }
    //合計金額
    getTotalprice(amount){
        return amount * this.price;
    }
    //お金が足りるか
    isEnoughMoney(amount,money){
        return this.getTotalprice(amount)< money;
    }
    //買うことができるか
    canBuy(amount,money){
        return this.isEnoughMoney(amount,money) && this.isMax(amount);
    }
    //最大所有数のチェック
    isMax(amount){
        return amount + this.posessions < this.maxPurchases;
    }
    purchase(amount,player){
        player.money -= parseInt(this.getTotalprice(amount));
        this.posessions += parseInt(amount);
    }

    setIncome(amount,player){
        if(this.type == "click"){
            player.oneClick += parseInt(this.income * amount);
            Update.oneClick(player)
        }else if(this.type == "realEstate"){
            player.income += this.income * amount;
        }else if(this.type == "stock"){
            player.stock += amount * this.price;
            this.price *= 1.1;
        }else if(this.type =="bond"){
            player.bond += amount * this.price;
        }
    }

}
class View{
    static displayNone(ele){
        ele.classList.remove("d-block");
        ele.classList.add("d-none");
    }

    static displayBlock(ele){
        ele.classList.add("d-block");
        ele.classList.remove("d-none");
    }

    static createMainContainer(player){
        let container = document.createElement("div");

        container.classList.add("d-flex","justify-content-center","align-items-center","p-3","col-10","fullHeight","maroon");

        container.innerHTML = `
            <div class="d-flex col-4 flex-column fullHeight black justify-content-between">
                <div id="buger-amount-window" class="text-center text-white mt-3">
                    <h5 id="buger-amount">${player.bugers} Bugers</h5>
                    <p id="one-click">one click ￥${player.oneClick}</p>
                </div>
                <div class="d-flex align-items-center justify-content-center mb-4">
                    <img id ="humbuger"class="img-fluid"src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiZQ2T87XFh7Uey2g7f4AzBt069odOigndEFLrXDl40UXAb2r0AiD0Ps4HsvWgB9eH-BzuGyNMhnnMnkYMXZhSuS1wG2bphuy2in59RG2oShXgpfsXpMDcjQnrJVmohjYawzI5j1XcL3bD5/s400/hamburger_meat_sauce.png">
                </div>
            </div>
            <div class = "col-8 d-flex flex-column purple justtify-content-center align-items-center fullHeight">
                <div class="d-flex flex-wrap col-10 bg-secondary m-3 statsHeight">
                    <div class="col-6 border border-dark">
                        <p id="player-name">${player.name}</p>
                    </div>
                    <div class="col-6 border border-dark">
                        <p id="player-age">${player.age} years old</p>
                    </div>
                    <div class="col-6 border border-dark">
                        <p id="player-day">${player.day} days</p>
                    </div>
                    <div class="col-6 border border-dark">
                        <p id="player-money">${player.money}$</p>
                    </div>
                </div>
                <div class = "d-flex justify-content-center col-12 p-3 itemHeight" >
                    <div id="item-page" class = "bg-secondary d-flex flex-column  d-block overflow-auto pb-3">
                    </div>
                </div>
                <div class = "col-12 d-flex justify-content-end">
                    <button id="save"class="btn btn-primary" type="save">save</button>
                </div>
            </div>

        `;
        
        container.querySelector("#humbuger").addEventListener("click",function(){
            player.clickHumbuger();
            Update.money(player);
            Update.bugers(player);
        })

        container.querySelector("#save").addEventListener("click",function(){
            player.save();
        })
        return container;
    }

    static createItemContainer(player){
        for(let i = 0;i < player.items.length;i++){
        let item = player.items[i];
        let container = document.createElement("div");

        container.classList.add("bg-secondary","d-flex","text-center","justify-content-center","height","border","border-dark");

        container.innerHTML = `
                    <div class="d-flex align-items-center col-12">
                        <div class="col-4">
                            <img src="${item.imgUrl}"class="img-fluid">
                        </div>
                        <div class="col-8 d-flex justify-content-around">
                            <div class ="col-5">
                                <h5>${item.name}</h5>
                                <h5>${item.price}</h5>
                            </div>
                            <div class="col-5">
                                <p id = "${item.id}">${item.posessions}</p>
                                <p>${item.income}</p>
                            </div>
                        </div>
                    </div>
        `;

        container.addEventListener("click",function(){
            let con = View.createPurchaseContainer(item,player);
            View.createPurchasePage(con);
        })

        config.itemPage.append(container);
    }
    }

    static createMainPage(player){
        this.displayNone(config.loginPage);
        this.displayBlock(config.mainPage);
        player.items = Setup.getInitialItemList();
        config.mainPage.append(this.createMainContainer(player));
        config.itemPage = document.getElementById("item-page");
        View.createItemContainer(player);
      
        
    }


    static createPurchaseContainer(item,player){
        let container = document.createElement("div");

        container.classList.add("d-flex","col-12","flex-column","justify-content-center","align-items-center","flex-grow-1","w-100");

        container.innerHTML=`
            <div id="info" class="col-12 d-flex">
                <div class="col-6 p-3">
                    <h3 class="text-center">${item.name}</h3>
                    <div class = "text-start">
                        <p>MaxPurchase:${item.maxPurchases}</p>
                        <p>Price:${item.price}</p>
                        <p>${item.discription}</p>
                    </div>
                </div>
                <img class="col-6 img-fluid " src="${item.imgUrl}">
            </div>
            <div class="input-group col-10">
                <span class="input-group-text">購入数</span>
                <input id ="purchaseInput"type="number" class="form-control" min="1" value="1">
                <h5 id = "total-price"class="text-end col-12">total:￥${item.getTotalprice(1)}</h5>
                <div class="col-12 d-flex justify-content-around">
                    <button id ="back-btn"type="button" class="btn btn-primary col-5">go back</button>
                    <button id ="purchase-btn"type="button" class="btn btn-primary col-5">purchase</button>
                </div>
            </div>
        `;

        Controller.backBtn(container,player);
        Controller.totalPriceInput(container,item);
        Controller.purchaseBtn(item,player,container)

        return container;
    }

    static createPurchasePage(ele){
        config.itemPage.innerHTML="";

        config.itemPage.append(ele);
        
    }

}

class Controller{
    static newEvent(){
        let playerName = document.getElementById("player-name").value;
        if(playerName ==="")return alert("名前を入力してください");
        this.newGame(playerName);
    }
    static loginEvent(){
        let playerName = document.getElementById("player-name").value;
        if(localStorage.getItem(playerName) === null){
            alert("保存されていません");
            return false;
        }

        let text = localStorage.getItem(playerName);

        this.load(text);

        console.log(text);
    
    }
    static newGame(name){
        let items = Setup.getInitialItemList();
        let player = new Player(name,0,20,5000000,0,25,0,items,0,0);

        View.createMainPage(player);

        setInterval(Update.Stats,1000,player);

    }

    static backBtn(ele,player){
        const btn = ele.querySelector("#back-btn");
        btn.addEventListener("click",function(){
            config.itemPage.innerHTML="";
            View.createItemContainer(player,)
        })
    }
    static totalPriceInput(ele,item){
        const purchaseInput = ele.querySelector("#purchaseInput");
        const totalText = ele.querySelector("#total-price");

        purchaseInput.addEventListener("change",function(){
            totalText.textContent = `total:￥${item.getTotalprice(purchaseInput.value)}`;
        })

    }
    static load(jsonDate){
        const data = JSON.parse(jsonDate);

        let player =  new Player(data.name,data.day,data.age,data.money,data.bugers,data.oneClick,data.income,data.items,data.stock,data.bond);
        
        View.createMainPage(player);

        setInterval(Update.Stats,1000,player);

    }

    static purchaseBtn(item,player,ele){
        

        let purchaseBtn = ele.querySelector("#purchase-btn");

        purchaseBtn.addEventListener("click",function(){
            let itemAmount = ele.querySelector("#purchaseInput").value;
            //購入可能なら

            if(item.isEnoughMoney(itemAmount,player.money)){
                
                item.purchase(itemAmount,player);
                item.setIncome(itemAmount,player);
                Update.money(player);
                
                config.itemPage.innerHTML="";

                View.createItemContainer(player);


                Update.posession(item);
            }else{
                console.log(player.money);
                console.log(item.getTotalprice(itemAmount));
                alert("お金が足りません");
            }
        })
    }

}
class Setup{
    static getInitialItemList(){
        const items = [
            new Item("Flip machine","click",15000,0,25,500,"https://cdn.pixabay.com/photo/2019/06/30/20/09/grill-4308709_960_720.png","クリック毎の収入が25増加","flip"),
            new Item("ETF Stock","stock",30000,0,0.001,Infinity,"https://cdn.pixabay.com/photo/2016/03/31/20/51/chart-1296049_960_720.png","ETFの銘柄をまとめて加算して、毎秒0.1%の金額を取得","stand"),
            new Item("ETF bond","bond",300000,0,0.0007,Infinity,"https://cdn.pixabay.com/photo/2016/03/31/20/51/chart-1296049_960_720.png","毎秒0.1%の収入","stock"),
            new Item("KitchenCar","realEstate",30000,0,30,1000,"https://cdn.pixabay.com/photo/2012/04/15/20/36/juice-35236_960_720.png","毎秒30円の収入","kitchen"),
            new Item("House","realEstate",20000000,0,32000,100,"https://cdn.pixabay.com/photo/2016/03/31/18/42/home-1294564_960_720.png","毎秒32000円の収入","house"),
            new Item("Town House","realEstate",40000000,0,64000,100,"https://cdn.pixabay.com/photo/2019/06/15/22/30/modern-house-4276598_960_720.png","毎秒64000円の収入","townHouse"),
            new Item("Mansion","realEstate",250000000,0,500000,20,"https://cdn.pixabay.com/photo/2017/10/30/20/52/condominium-2903520_960_720.png","毎秒500000円の収入","mansion"),
            new Item("Industrial Space","realEstate",1000000000,0,2200000,10,"https://cdn.pixabay.com/photo/2012/05/07/17/35/factory-48781_960_720.png","毎秒2200000円の収入","industrial"),
            new Item("Hotel Skyscraper","realEstate",10000000000,0,25000000,5,"https://cdn.pixabay.com/photo/2012/05/07/18/03/skyscrapers-48853_960_720.png","毎秒25000000円の収入","hotel"),
            new Item("Bullet Speed Sky Railway","realEstate",1000000000000,0,300000000,1,"https://cdn.pixabay.com/photo/2013/07/13/10/21/train-157027_960_720.png","毎秒300000000円の収入","bullet")

        ]

        return items;
    }
}

class Update{
    static posession(item){
        let posessionEle = config.itemPage.querySelector(`#${item.id}`);
        
        posessionEle.textContent = item.posessions;
    }

    static oneClick(player){
        config.mainPage.querySelector("#one-click").textContent = player.oneClick;
    }

    static day(player){
        config.mainPage.querySelector("#player-day").textContent = player.day + "days";
    }
    static age(player){
        config.mainPage.querySelector("#player-age").textContent = player.age + "years old";
    }

    static money(player){
        config.mainPage.querySelector("#player-money").textContent = "￥" + player.money;
    }
    static bugers(player){
        config.mainPage.querySelector("#buger-amount").textContent = player.bugers + " " + "Burgers";
    }

    static Stats(player){
        player.incomePerSecond();
        player.divident();
        player.advanceDay();
    }
}

document.getElementById("new-btn").addEventListener("click",function(){Controller.newEvent()});
document.getElementById("login-btn").addEventListener("click",function(){Controller.loginEvent()});

