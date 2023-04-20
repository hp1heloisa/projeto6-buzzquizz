axios.defaults.headers.common['Authorization'] = 'vCvQhdKuWXtO3cwYJuvsXTZs';
let promiseQuizzes = axios.get("https://mock-api.driven.com.br/api/vm/buzzquizz/quizzes");
promiseQuizzes.then(renderQuizzes);
promiseQuizzes.catch(alert);

function renderQuizzes(list){
    const all = document.querySelector('.allQuizzes');
    const your = document.querySelector('.yourQuizzes');
    const ownId = localStorage.getItem("id");
    if (ownId == undefined){
        your.classList.add('divCreate');
        your.innerHTML += '<div class="textYour">Você não criou nenhum quizz ainda :(</div>';
        your.innerHTML += '<div class="create" onclick="createQuizz()">Criar Quizz</div>';
    } else{
        your.innerHTML += '<div class="titleYour"><span>Seus Quizzes</span> <ion-icon name="add-circle" onclick="createQuizz()"></ion-icon></div>';
        your.innerHTML += '<div class="allYourQuizzes"></div>';
        const addYour = document.querySelector('.allYourQuizzes');
        console.log(list.data);
        list.data.forEach(element => {
            if (ownId == element.id){
                addYour.innerHTML += `<div class="caseQuizz" onclick="playQuizz()"> 
                                            <div class="imgCase" style="background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.5) 64.58%, #000000 100%), url(${element.image});">
                                                <span>${element.title}</span>
                                            </div>
                                        </div>`
            }
        }
        );
    }
    list.data.forEach(element => {
        console.log(element);
        all.innerHTML += `<div class="caseQuizz" onclick="playQuizz()"> 
                                <div class="imgCase" style="background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.5) 64.58%, #000000 100%), url(${element.image});">
                                <span>${element.title}</span>
                                </div>
                         </div>`
    });
}
function playQuizz(){
    alert();
}
function createQuizz(){
    alert();
}