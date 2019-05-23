var kue = require("kue");
var Queue = kue.createQueue();

let scheduleInstantJob = data => {
  console.log(data);
  Queue.createJob(data.jobName, data.params)
    .attempts(3)
    .delay(data.time - Date.now()) // relative to now.
    .save()
};

let scheduleRecurrentJob = data => {
    Queue.createJob();
}

module.exports = {
    scheduleInstantJob,
    scheduleRecurrentJob
};