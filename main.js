let currentTags = []; 
const dataForJobs = [] 

async function getDataFromJSON(url = '/data.json') { 
    const respone = await (await fetch(url)).json()
    return respone ; 
}


class Job{ 



    constructor(data , containter='.job__cont'){ 
        
        this.data = data ; 
        this.containter = document.querySelector(containter); 
        
        this.tags = this.getTags()

        
        

    }

    
    getTags() { 

        const tags = [this.data.role , this.data.level]
        
        this.data.languages.map(item => tags.push(item))
        this.data.tools.map(item => tags.push(item))

        

        return tags ; 
        

    }

    checkTags(currentTags) {
        let output = currentTags.filter(tag => this.tags.includes(tag))
        return output.length>=currentTags.length; 
    }

    createItem() { 
        let isTop = this.data.featured  ? "afterBegin" : "beforeEnd" ;  
        let isNew = this.data.new ; 
        let isFeatured = this.data.featured ; 

        this.containter.insertAdjacentHTML(isTop,`
        <div class="job__item ${isFeatured ? "job__item--featured" : ""} ${isNew ? "job__item--new" :""}">
                  
        <div class="item__company-info">
           <img src="${this.data.logo}" alt="" class="company__logo">
           <div class="company__header">
              <div class="header__short-info">
                <span class="company__name">
                  ${this.data.company}
                </span>
                <div class="company__post">
                    ${isNew ? '<button class="post post--new">new!</button>' : ""}
                    ${isFeatured ? '<button class="post post--featured">featured</button>' : ""}
                </div>
              </div>
           
           <span class="job__name">${this.data.position}</span>
           <span class="company__footer">
                ${this.data.postedAt} · ${this.data.contract} · ${this.data.location}
           </span>
          </div>
        </div>

        <div class="item__tags">
            ${this.tags.map(tag => `<button class="tag">${tag}</button>`).join("")}   
        </div>
      </div>
        `)

      
    }
}

const clearCont = (main = ".job__cont" , nameItem = ".job__item") => { 
   
    
    document.querySelectorAll(nameItem).forEach( (child) => {
        document.querySelector(main).removeChild(child)
    })
}

const filterTags = (jobs , currentTags , event ,  fitlerContainter = document.querySelector(".filter__list")    ) => { 
    jobs = jobs.filter(job => job.checkTags(currentTags))
    jobs.map(job => job.createItem()) ; 

    

    fitlerContainter.insertAdjacentHTML("beforeEnd" , `
        <div class="filter__item">
            <button class="tag">${event.target.innerHTML}</button>
            <img src="./images/icon-remove.svg" alt="X" class="filter__remove">
        </div>
        `)
    
    const filterRemoves = fitlerContainter.querySelectorAll(".filter__remove") ;
    
    filterRemoves.forEach(remove => { 
        remove.addEventListener('click',() => filterRemove(remove.parentNode))
    })
    
    screenReloader(jobs)  ; 
}

const filterRemove = (removeBtn) => { 
    // currentTags = currentTags.filter(item => item!=removeBtn.)
    console.log(removeBtn)
}
const screenReloader = (jobs) =>  { 

    clearCont()
    
    jobs.map(item => item.createItem());

    const tags = document.querySelectorAll('.tag') ; 
    
    tags.forEach(tag => tag.addEventListener('click', () => { 
        if(!currentTags.includes(tag.innerHTML)){ 
            currentTags.push(tag.innerHTML)
           
            filterTags(jobs,currentTags , event)
        }
    }))

}

const clearFitler = (mainJobs) => { 
    currentTags = [] ; 
    clearCont('.filter__list' , '.filter__item') ;     

    screenReloader(mainJobs) ; 

}
document.addEventListener("DOMContentLoaded" , getDataFromJSON().then(
    data => { 
        data.map(item => dataForJobs.push((item))) ; 

        const jobs = dataForJobs.map(item => new Job (item))

        const fitlerClear = document.querySelector('.filter__clear');
        fitlerClear.addEventListener('click', () => clearFitler(jobs)) ; 

        
        screenReloader(jobs)

    }
    

))
