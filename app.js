class Car {
  constructor(carMake, carModel, year) {
    this.carMake = carMake;
    this.carModel = carModel;
    this.year = year;
  }
}

class UI {
  addCarToList(car) {
    const list = document.getElementById('car-list');
    //create tr
    const row = document.createElement('tr');
    //insert cols
    row.innerHTML = `
    <td>${car.carMake}</td>
    <td>${car.carModel}</td>
    <td>${car.year}</td>
    <td><a href="#" class="delete">x<a></td>
    `;
    list.appendChild(row);
  }

  clearFields() {
    document.getElementById('car-make').value = '';
    document.getElementById('car-model').value = '';
    document.getElementById('year').value = '';
  }

  showAlert(message, className) {
    //create div
    const div = document.createElement('div');
    //add class
    div.className = `alert ${className}`;
    //create text
    div.appendChild(document.createTextNode(message));
    //get parent
    const container = document.querySelector('.container');
    //get form
    const form = document.querySelector('#car-form');
    //insert alert
    container.insertBefore(div, form);
    //time out 3 sec
    setTimeout(function () {
      document.querySelector('.alert').remove();
    }, 3000);
  }

  deleteCar(target) {
    if (target.className === 'delete') {
      target.parentElement.parentElement.remove();
    }
  }
}

//local storage class
class Store {
  static getCars() {
    let cars;
    if (localStorage.getItem('cars') === null) {
      cars = [];
    } else {
      cars = JSON.parse(localStorage.getItem('cars'));
    }
    return cars;
  }

  static displayCars() {
    const cars = Store.getCars();

    cars.forEach(function (car) {
      const ui = new UI();

      //add car to ui
      ui.addCarToList(car);
    });
  }

  static addCar(car) {
    const cars = Store.getCars();

    cars.push(car);

    localStorage.setItem('cars', JSON.stringify(cars));
  }

  static removeCar(year) {
    const cars = Store.getCars();

    cars.forEach(function (car, index) {
      if (car.year === year) {
        cars.splice(index, 1);
      }
    });

    localStorage.setItem('cars', JSON.stringify(cars));
  }
}

//don event
document.addEventListener('DOMContentLoaded', Store.displayCars);

//event for submit
document.getElementById('car-form').addEventListener('submit', function (e) {
  //get form element
  const carMake = document.getElementById('car-make').value;
  const carModel = document.getElementById('car-model').value;
  const year = document.getElementById('year').value;

  //instatiate car
  const car = new Car(carMake, carModel, year);

  //instatiate ui
  const ui = new UI();

  //validate
  if (carMake === '' || carModel === '' || year === '') {
    ui.showAlert('please fill all fields', 'error');
  } else {
    //add car to list
    ui.addCarToList(car);

    //add to ls
    Store.addCar(car);

    //show success
    ui.showAlert('Car Added!', 'success');

    //clear field
    ui.clearFields();
  }

  e.preventDefault();
});

//event for delete
document.getElementById('car-list').addEventListener('click', function (e) {
  //instatiate
  const ui = new UI();
  //delete car
  ui.deleteCar(e.target);

  //remove from ls
  Store.removeCar(e.target.parentElement.previousElementSibling.textContent);

  //show message
  ui.showAlert('Car Removed!', 'success');

  e.preventDefault();
});
