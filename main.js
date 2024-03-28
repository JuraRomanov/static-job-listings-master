async function getDataFromJSON(url = '/data.json') { 
    const respone = await (await fetch(url)).json()
    return respone ; 
}


class Job{ 



    constructor(data , containter='.job__cont'){ 
        
        this.data = data ; 
        this.containter = document.querySelector(containter); 
        
        this.tags = this.getTags()

        this._createItem();
        

    }

    getTags() { 

        const tags = [this.data.role , this.data.level]
        
        this.data.languages.map(item => tags.push(item))
        this.data.tools.map(item => tags.push(item))

        

        return tags ; 
        

    }
    _createItem() { 
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



document.addEventListener("DOMContentLoaded" , getDataFromJSON().then(
    data => {
        data.map(item => new Job(item))
    }
))