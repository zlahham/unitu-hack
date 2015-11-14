var app = angular.module('aftBasic', ['myFirebase']);

app.controller('MainCtrl', function($scope, firebase) {

    $scope.attendees = {};
    var meRef, me;

    var attendeesRef = firebase.child('attendees');

    var newAttendee = attendeesRef.push();

    attendeesRef.on('child_added', function(snapshot) {
      $scope.attendees[snapshot.name()] = snapshot.val();
      if(!$scope.$$phase) {
        $scope.$apply();
      }
    });

    attendeesRef.on('child_changed', function(snapshot) {
      $scope.attendees[snapshot.name()] = snapshot.val();
      if(!$scope.$$phase) {
        $scope.$apply();
      }
    });

    var myName = localStorage.getItem('attendee');

    if (!myName) {
      meRef = newAttendee;
      newAttendee.set({status: 0});
      localStorage.setItem('attendee', meRef.name());
    } else {
      meRef = attendeesRef.child(myName);
    }

    meRef.once('value', function(data) {
      me = data.val();
    });

    $(document).keydown(function(e){
      if (e.keyCode == 38) {
        me.status += 1;
        meRef.child('status').set(me.status);
      }

      if (e.keyCode == 40) {
        me.status -= 1;
        meRef.child('status').set(me.status);
      }
    });

    $scope.calcOpacity = function(color) {
      if (color === 'red') {
        return -1 * me.status;
      } else {
        return me.status;
      }
    }

});
