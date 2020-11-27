(async function() {
    setTimeout(setup, 500);

    window.onbeforeunload = function () {
        window.scrollTo(0, 0);
    }

    document.body.style.overflow = "hidden";
    document.body.style.overflowX = "hidden";

    const elem = document.documentElement;
    if (elem.requestFullscreen) {
        elem.requestFullscreen()
    }

    // Time to fix the welcome text size
    let phone_width = document.querySelector('.workspace--phone>img').width;

    // Make photo text
    let object = document.querySelector('.workspace--phone>h1[photo]');

    object.style.fontSize = (phone_width / object.innerText.length + 5) + 'px';
    object.style.opacity = '0';
    object.style.display = 'block';

    // Heading sizes
    let header = document.querySelector('.workspace--header>h3');

    header.style.fontSize = (phone_width / header.innerText.length + 5) + 'px';

    // Span
    let spans = document.querySelectorAll('.workspace--innertext>p');

    spans.forEach(function(span) {

        span.style.fontSize = (phone_width / header.innerText.length - 10) + 'px';

    });

    setTimeout(function() {
        object.classList.add('opacity-up');
        document.body.style.overflowY = "scroll";
    }, 2000);

    let phone = document.querySelector('.workspace--phone');
    let screen = document.querySelector('.workspace--screen');

    phone.onclick = function() {

        window.scrollTo(0, 0);

        this.classList.add('workspace--zoom');

        object.classList.add('opacity-down');
        object.classList.remove('opacity-up');

        screen.classList.add('workspace--photo');

        document.body.style.overflow = "hidden";

        setTimeout(function () {

            screen.classList.add('workspace--black');

        }, 500);
        document.body.style.backgroundColor = "white";
        init();

    };

})();

// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

// the link to your model provided by Teachable Machine export panel
const URL = "https://teachablemachine.withgoogle.com/models/-MczCq0pJ/";

let model, webcam, labelContainer, maxPredictions;

async function setup()
{
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Convenience function to setup a webcam
    const flip = false; // whether to flip the webcam
    webcam = new tmImage.Webcam(window.innerWidth, window.innerWidth, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();
}
// Load the image model and setup the webcam
async function init() {

    // const modelURL = URL + "model.json";
    // const metadataURL = URL + "metadata.json";

    // // load the model and metadata
    // // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // // or files from your local hard drive
    // // Note: the pose library adds "tmImage" object to your window (window.tmImage)
    // model = await tmImage.load(modelURL, metadataURL);
    // maxPredictions = model.getTotalClasses();

    // // Convenience function to setup a webcam
    // const flip = true; // whether to flip the webcam
    // webcam = new tmImage.Webcam(window.innerWidth, screen.height, flip); // width, height, flip
    // await webcam.setup(); // request access to the webcam
    // await webcam.play();
    window.requestAnimationFrame(loop);

    // append elements to the DOM
    document.getElementById("webcam-container").appendChild(webcam.canvas);
    // labelContainer = document.getElementById("label-container");
    // for (let i = 0; i < maxPredictions; i++) { // and class labels
    //     labelContainer.appendChild(document.createElement("div"));
    // }

}

async function loop() {

    webcam.update(); // update the webcam frame
    await predict();
    // window.requestAnimationFrame(loop);

}

// run the webcam image through the image model
async function predict() {
    // predict can take in an image, video or canvas html element
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        console.log(prediction[i].className + ": " + prediction[i].probability.toFixed(2))
        if (prediction[i].probability.toFixed(2)>0.50) {
            switch (+prediction[i].className) {
                case 1 : writeDescription(1); break
                case 7 : writeDescription(2); break
                case 8 : writeDescription(2); break
                default : continue;
            }
        }
    }
    
}

let descriptions = [
    ["Байтерек", `Это, пожалуй, самый главный и известный символ казахской столицы. Проект был запущен по инициативе Нурсултана 
    Назарбаева – первого президента РК. Архитектор – Акмурза Рустембеков. Высота монумента 105 метров, диаметр шара – 22.`,
    `Сам Байтерек по представлениям древних кочевников представляет собой священное дерево, 
    объединяющее три мира: подземный, земной и небесный. `, `Монумент олицетворяет молодое, крепкое дерево, символизирующее 
    растущее государство, помнящее свои корни и устремленное в будущее.`,],

    [`Военно-исторический музей вооруженных сил РК`,`Музей подразделяется на залы по эпохам и тематике: от древности до новейшей 
    истории и изобразительного искусства. Комплекс включает в себя свыше 6000 экспонатов, среди которых редкие и особо ценные 
    исторические и культурные памятники, амуниция казахских воинов от каменного века до наших дней. Оружие и Картины, 
    исторические документы и снимки событий. Стенды родов войск, событий и известных личностей.`,
    `Военно-исторический музей — один из самых технически оснащенный во всей стране. К достоинствам можно отнести LED 
    мониторы шириной во всю стену, на которых транслируются тщательно отснятые ролики об истории военных походов времен 
    казахских ханов и документальные фильмы о Великой Отечественной Войне.`,
    `Здесь можно прикоснуться к истории в буквальном смысле, так как там позволяется многое не только увидеть, 
    но и потрогать, послушать предметы, рассказывающее об истории Казахстана.`,]
]

function writeDescription(num) {
    num = num - 1;
    let ds = descriptions[num]
    document.getElementById("objname").innerHTML = descriptions[num][0];
    let parent = document.getElementById("info");
    let max = ds.length;

    for (let i = 1; i < max; i++) {
        let p = document.createElement('p');
        p.innerHTML = ds[i]
        console.log(ds[i])
        parent.appendChild(p);
    }
}