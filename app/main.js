var app = angular.module('todoApp', [
  'ngMap', 'weatherModule', 'ngSanitize'
]);
app.service('sharedProperties', function() {
  var todoText = {
    text: 'Petrópolis, RJ'
  };

  return {
    getProperty: function() {
      return todoText.text;
    },
    setProperty: function(value) {
      todoText = value;
    }
  };
});


app.controller('ForecastController', function($scope, $http) {

  $scope.data = null;
  $scope.weatherDescription = null;
  $scope.weatherIcon = null;
  $scope.mainTemp = null;

  var local = 'Itaguai,RJ';
  var APPID = '44db6a862fba0b067b1930da0d769e98';
  var LANG = 'pt';
  var units = 'metric';
  var url = 'http://api.openweathermap.org/data/2.5/weather?q=';

  $http.get(url + local + '&APPID=' + APPID + '&lang=' + LANG + '&units=' + units).success(function(data) {
    $scope.name = data.name;
    $scope.test = data;
    $scope.weatherDescription = data.weather[0].description;
    $scope.weatherIcon = data.weather[0].icon;
    $scope.mainTemp = data.main.temp;
    $scope.maxTemp = data.main.temp_max;
    $scope.minTemp = data.main.temp_min;


    $scope.data = JSON.stringify(data);
    //var weather = JSON.parse(data);
    console.log('sucesso!' + $scope.data);
  }).error(function(data) {
    console.log('Erro :(');
  });
});

//inicio
app.controller('TimeController', function($scope, $interval) {

  $scope.init = $interval(function() {
    var date = new Date();

    $scope.dates = [{
      "date1": date
    }]
  }, 100)

});

app.filter('datetime', function($filter) {
  return function(input) {
    if (input == null) {
      return "";
    }

    var _date = $filter('date')(new Date(input), 'MMM dd yyyy - HH:mm:ss');

    return _date.toUpperCase();

  };
});
//final
app.controller('TodoListController', function($scope, $rootScope, sharedProperties) {
  $scope.todos = [{
    text: 'learn angular',
    done: true
  }, {
    text: 'build an angular app',
    done: false
  }];

  $scope.addTodo = function() {
    var textObj = {
      text: $scope.todoText
    };
    sharedProperties.setProperty(textObj);
    $scope.todos.push({
      text: $scope.todoText,
      done: false
    });
    $scope.todoText = '';
  };

  $scope.remaining = function() {
    var count = 0;
    angular.forEach($scope.todos, function(todo) {
      count += todo.done ? 0 : 1;
    });
    return count;
  };

  $scope.archive = function() {
    var oldTodos = $scope.todos;
    $scope.todos = [];
    angular.forEach(oldTodos, function(todo) {
      if (!todo.done) $scope.todos.push(todo);
    });
  };

  if (annyang) {
    var commands = {
      'inserir *val': function(val) {
        $scope.todoText = val;
        $scope.addTodo();
        $scope.$apply();
      },
      'marcar número *val': function(val) {
        $scope.todos[parseInt(val) - 1].done = true;
        $scope.$apply();
      },
      'desmarcar número *val': function(val) {
        $scope.todos[parseInt(val) - 1].done = false;
        $scope.$apply();
      },
    }
  }
  annyang.setLanguage('pt-BR');
  annyang.addCommands(commands);
  annyang.debug();
  annyang.start();
});

app.controller('GMapController', function(NgMap, $scope, sharedProperties) {

  $scope.getProperty = function() {
    $scope.todoText = sharedProperties.getProperty();
  };

  //testar com esse controller
  if (annyang) {
    var commands = {
      'buscar mapa *val': function(val) {
        $scope.todoText = sharedProperties.getProperty();
      }
    };
  }
  //$scope.googleMapsUrl="https://maps.googleapis.com/maps/api/js?key=AIzaSyAFrWHRVbxgqZ8GXulzYSihE6lTB4engZU"
  NgMap.getMap().then(function(map) {
    console.log(map.getCenter());
    console.log('markers', map.markers);
    console.log('shapes', map.shapes);

  });
});
