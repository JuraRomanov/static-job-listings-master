let currentTags = []; 
const dataForJobs = [] ; 
let filters ; 

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



class TagsFilters { 

    constructor(mainJobs , containter = ".filter__list") { 
        this.currentTags = [] ; 

        this.mainJobs = mainJobs  ;
        this.jobs = mainJobs  ;

        this.containter = containter ;

        this.filterClear = document.querySelector('.filter__clear').addEventListener("click" , ()=> { 
            this.currentTags = [] ; 
            clearCont(this.containter , '.filter__item') ;

            screenReloader(mainJobs) ; 


        })
    }

    getTags() { 
        return this.currentTags; 
    }

    addTags(newTag) {
        this.currentTags.push(newTag);
    }

    removeTags(itemRemoved){ 
        this.currentTags = this.currentTags.filter(tag => tag != itemRemoved.querySelector('.tag').innerHTML)
        this.filterJob() ; 

    }
    filterJob(jobs = this.mainJobs) { 
        this.jobs = jobs.filter( job => job.checkTags(this.currentTags)); 

        this.jobs.map(job => job.createItem());
        clearCont(this.containter , ".filter__item")
        this.currentTags.map( tag => this.createFilter(tag)) ; 

        screenReloader(this.jobs)
        
    }

    createFilter(textTag){ 
        document.querySelector(this.containter).insertAdjacentHTML("beforeEnd" , `
            <div class="filter__item">
                <button class="tag">${textTag}</button>
                <img src="./images/icon-remove.svg" alt="X" class="filter__remove">
            </div>
        `)

        const filterRemoves = document.querySelectorAll(".filter__remove") ;
    
        filterRemoves.forEach(remove => { 
            remove.addEventListener('click',() => this.removeTags(remove.parentNode))
        })
    }


} 




const clearCont = (main = ".job__cont" , nameItem = ".job__item") => { 
   
    
    document.querySelectorAll(nameItem).forEach( (child) => {
        document.querySelector(main).removeChild(child)
    })
}
const screenReloader = (jobs) =>  { 

    clearCont()
    
    jobs.map(item => item.createItem());

    const tags = document.querySelectorAll('.tag') ; 
    
    tags.forEach(tag => tag.addEventListener('click', () => { 
        if(!filters.getTags().includes(tag.innerHTML)){ 
            filters.addTags(tag.innerHTML)
           
            filters.filterJob(jobs) ; 
        }
    }))

}


document.addEventListener("DOMContentLoaded" , getDataFromJSON().then(
    data => { 
        data.map(item => dataForJobs.push((item))) ; 

        let jobs  = dataForJobs.map(item => new Job (item))
        
       

        filters = new TagsFilters(jobs)
        screenReloader(jobs)

    }
    

))
