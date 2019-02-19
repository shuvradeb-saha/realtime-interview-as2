$(document).ready(function () {
    console.log("start");
    //let problemId;
    $('[name=update]').click(function () {
        console.log("abc");
        let workingObject = $(this).parent().parent().parent();
        let problemId = workingObject.find('input').val();
        let userName = $('#userName').val();
        $('#submit').val('Update')
        console.log('Problem id: ' + problemId);
        $.ajax({
            type: "GET",
            url: "/admin/" + userName + "/problems/" + problemId,
            success: function (problem) {
                populateFieldsWithData(problem);
                $('#myModal').modal('show');
            },
            error: function (e) {
                alert("Error");
            }
        });
    });

    $('#create-problem').click(function () {
        clear();
        $('#submit').val('Submit');
        $('#myModal').modal('show');

    });

    $('#submit').click(function () {
        if ($('#submit').val() == 'Submit') ajaxPOST();
        else ajaxPUT();
    })

    function ajaxPOST() {
        let userName = $('#userName').val();
        let problem = getProblemDescription();
        $.ajax({
            type: "POST",
            data: problem,
            url: "/admin/" + userName + "/problems",
            success: function (msg) {
                //alert(msg);
                $('#myModal').modal('toggle');
            },
            error: function (e) {
                alert("Error: " + JSON.stringify(e));
            }
        });
    }

    function ajaxPUT() {
        let userName = $('#userName').val();
        let problemId = $('#_id').val();
        let problem = getProblemDescription();
        console.log("Problem: " + problem);
        $.ajax({
            type: "PUT",
            data: getProblemDescription(),
            url: "/admin/" + userName + "/problems/" + problemId,
            success: function (msg) {
               // alert(msg);
                $('#myModal').modal('toggle');
            },
            error: function (e) {
                alert("Error: " + e);
            }
        });
    }

    function ajaxDELETE() {
        let userName = $('#userName').val();
        let problemId = $('#_id').val();

        $.ajax({
            type: "DELETE",
            url: "/admin/" + userName + "/problems/" + problemId,
            success: function (msg) {
                //alert(msg)
            },
            error: function (e) {
                alert("Error: " + e);
            }
        });
    }


    function populateFieldsWithData(problem) {
        console.log("ID " + problem._id);
        $('#_id').val(problem._id);
        $('#title').val(problem.problemTitle);
        $('#timeLimit').val(problem.timeLimit);
        $('#memoryLimit').val(problem.memoryLimit);
        $('#details').val(problem.problemDetails);
        $('#sampleInput').val(problem.sampleInput);
        $('#sampleOutput').val(problem.sampleOutput);
        $('#input').val(problem.input);
        $('#output').val(problem.output);

    }

    function clear() {
        $('#_id').val('');
        $('#title').val('');
        $('#timeLimit').val('');
        $('#memoryLimit').val('');
        $('#details').val('');
        $('#sampleInput').val('');
        $('#sampleOutput').val('');
        $('#input').val('');
        $('#output').val('');
        $('#myModal').modal('show');
    }

    function getProblemDescription() {
        return {
            _id: $('#_id').val(),
            problemTitle: $('#title').val(),
            timeLimit: $('#timeLimit').val(),
            memoryLimit: $('#memoryLimit').val(),
            problemDetails: $('#details').val(),
            sampleInput: $('#sampleInput').val(),
            sampleOutput: $('#sampleOutput').val(),
            input: $('#input').val(),
            output: $('#output').val(),
            setterName: $('#userName').val(),
        };
    }
});