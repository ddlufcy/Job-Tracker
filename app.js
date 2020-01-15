class Job {
    constructor(company, jobTitle, applicationDate, additional) {
        this.company = company;
        this.jobTitle = jobTitle;
        this.applicationDate = applicationDate;
        this.additional = additional;
    }
};

//UIgit
class UI {
    addJobToList(job) {
        const list = document.getElementById('application-list');
        const row = document.createElement('tr');
        row.innerHTML = `
    <td>${job.company}</td>
    <td>${job.jobTitle}</td>
    <td>${job.applicationDate}</td>
    <td>${job.additional}</td>
    <td><a id="deleteJob" href="#" class="delete">X</a></td>
    `;
        list.appendChild(row);
    }
    showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert ${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('application-form');
        container.insertBefore(div, form);

        setTimeout(function () {
            document.querySelector('.alert').remove();
        }, 3000);
    }
    deleteJob(target) {
        if (target.className === 'delete') {
            target.parentElement.parentElement.remove();
        }
    }
   
    clearFields() {
        document.getElementById('companyName').value = '';
        document.getElementById('jobTitle').value = '';
        document.getElementById('applicationDate').value = '';
        document.getElementById('additionalInfo').value = '';
    }
}; //end of UI class

//Local Storage Class
class Store {
    static getJobs() {
        let jobs;
        if (localStorage.getItem('jobs') === null) {
            jobs = [];
        } else {
            jobs = JSON.parse(localStorage.getItem('jobs'));
        }
        return jobs;
    }
    // static keepClass() {

    // }
    static displayJobs() {
        const jobs = Store.getJobs();
        
        jobs.forEach(function (job) {
            const ui = new UI;
            ui.addJobToList(job);
        })
    }
    static addJob(job) {
        const jobs = Store.getJobs();
        jobs.push(job);
        localStorage.setItem('jobs', JSON.stringify(jobs));
    }
    static removeJob(applicationDate) {
        const jobs = Store.getJobs();
        jobs.forEach(function (job, index) {
            if (job.applicationDate === applicationDate) {
                jobs.splice(index, 1);
            }
        });
        localStorage.setItem('jobs', JSON.stringify(jobs));

    }
};
//DOM Load Event
document.addEventListener('DOMContentLoaded', Store.displayJobs);

//Event Listeners
document.getElementById('application-form').addEventListener('submit', function (e) {
    //get form values
    const company = document.getElementById('companyName').value;
    const jobTitle = document.getElementById('jobTitle').value;
    const applicationDate = document.getElementById('applicationDate').value;
    const additional = document.getElementById('additionalInfo').value;

    const job = new Job(company, jobTitle, applicationDate, additional);

    const ui = new UI();
    if (company === "" || jobTitle === "" || applicationDate === "" || additional === "") {
        ui.showAlert("Fill in all fields", 'error')
    } else {
        ui.addJobToList(job);
        //Local Storage
        Store.addJob(job);

        ui.showAlert('Job Added', 'success');
        ui.clearFields();
    };

    e.preventDefault();
});

//Event Listener For Delete
document.querySelector('#application-list').addEventListener('click', function (e) {
    const ui = new UI();
    ui.deleteJob(e.target);
    //Remove from local Storage
    Store.removeJob(e.target.parentElement.previousElementSibling.previousElementSibling.textContent);
    ui.showAlert('Job Removed', 'success');
    e.preventDefault();
});

// //Event Listener Job Status
// let jobStatus = document.querySelector('#application-list').addEventListener('dblclick', function (e) {
//     const ui = new UI();

//     ui.jobStatus(e.target);
//     ui.showAlert('Watching Job', 'watching');
//     e.preventDefault();
// });