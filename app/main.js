var app = angular.module('todoApp', []);

  app.controller('TodoListController', function($scope) {
    $scope.todos = [
      {text:'learn angular', done:true},
      {text:'build an angular app', done:false}];

    $scope.addTodo = function() {
      $scope.todos.push({text:$scope.todoText, done:false});
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

    if(annyang){
      var commands = {
          'inserir *val' : function(val){
          $scope.todoText = val;
          $scope.addTodo();
          $scope.$apply();
        },
          'marcar número *val': function(val){
          $scope.todos[parseInt(val)-1].done = true;
          $scope.$apply();
        },
        'desmarcar número *val' : function(val){
          $scope.todos[parseInt(val)-1].done = false;
          $scope.$apply();
        }
      }
    }
    annyang.setLanguage('pt-BR');
    annyang.addCommands(commands);
    annyang.debug();
    annyang.start();



  });
