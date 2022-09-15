const description = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,"

const numberOfData = 20;

let dataDummy = [];

createData();

async function callDummy() {

  let element = {};

  for (let index = 0; index < numberOfData; index++) {
    element = {
      id: index,
      description: description,
      registered: await randomNumber(),
      maxguests: 5,
      image: ''
    };
    dataDummy.push(element);
  }
}

async function randomNumber() {
  return Math.floor(Math.random() * 6);
}

async function createData() {
  await callDummy();
  console.log(dataDummy);
}