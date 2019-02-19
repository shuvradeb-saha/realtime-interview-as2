$(document).ready(function () {
    console.log("start");
    $('[name=createRoom]').click(function () {
        let workingObject = $(this).parent().parent();
        let problemId = workingObject.find('input').val();
        let problemTitle = workingObject.find('[name=problemTitle]').val();
        $('#roomModal').modal({
            backdrop: 'static',
            keyboard: false
        })
        $('#roomProblemId').val(problemId);
        $('#roomProblemTitle').val(problemTitle);
        $('#roomModal').modal('show');
    });

    $('#room').click(function () {
        const userName = $('#userName').val();
        $(window).attr("location", "/admin/" + userName + "/rooms");
    })

    $('#submitRoom').click(function () {
        let roomName = $('#roomName').val();
        let problemId = $('#roomProblemId').val();
        let problemTitle = $('#roomProblemTitle').val();
        let userName = $('#userName').val();

        if (roomName == "") {
            alert("Room Name Cant Be Empty");
            return;
        }

        $.ajax({
            type: "POST",
            data: {
                roomName: roomName,
                _id: problemId,
                problemTitle: problemTitle
            },
            url: "/admin/" + userName + "/rooms",
            success: function (msg) {
                //alert(msg);
                $('#roomModal').modal('toggle');
            },
            error: function (e) {
                alert("Error: " + JSON.stringify(e));
            }
        });
      //  alert("room  " + roomName + " pid " + problemId);
    });

    $('#goRoomBtnAdmin').click(function () {
        let roomId = $('#goRoomId').val();
        const userName = $('#userName').val();
        if (!roomId) {
            alert("enter room id");
            return;
        }
         $.ajax({
             type: "PUT",
             data: {
                 collaborator: userName
             },
             url: "/room/" + roomId,
             success: function (msg) {
                 // alert(msg);

             },
             error: function (e) {
                 alert("Error: " + JSON.stringify(e));
             }
         });

        $(window).attr("location", "/room?room=" + roomId);


    });

    $('#goRoomBtn').click(function () {
        let roomId = $('#goRoomId').val();
        const userName = $('#userName').val();
        if (!roomId) {
            alert("enter room id");
            return;
        }
        $.ajax({
            type: "PUT",
            data: {
                candidate: userName
            },
            url: "/room/" + roomId,
            success: function (msg) {
                // alert(msg);

            },
            error: function (e) {
                alert("Error: " + JSON.stringify(e));
            }
        });
        // alert(roomId);

        $(window).attr("location", "/room?room=" + roomId);


    });

});