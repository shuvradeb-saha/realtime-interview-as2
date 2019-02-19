$(document).ready(function () {
    $('[name=go-room-btn]').click(function () {
        $(window).attr("location", "/room?room=" + $(this).attr('id'));

    })
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

    });
})