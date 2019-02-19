$(document).ready(function () {
    const url = "https://api.judge0.com/submissions"

    function getExampleRef() {
        var ref = firebase.database().ref();
        var hash = window.location.hash.replace(/#/g, '');
        if (hash) {
            ref = ref.child(hash);
        } else {
            ref = ref.push(); // generate unique location.
            window.location = window.location + '#' + ref.key; // add it as a hash to the URL.
        }
        if (typeof console !== 'undefined') {
            console.log('Firebase data: ', ref.toString());
        }
        return ref;
    }
    var getUrlParameter = function getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
    };
    const location = $(window).attr('location');
    const roomId = getUrlParameter('room');
    console.log(location + " related " + roomId)
    if (window.location.href.indexOf("#") <= -1) {
        $(window).attr('location', location + "#" + roomId);
    }

    var config = {
        apiKey: "AIzaSyDIj1NLnXxGN9h_3aoE1TMSvBcsyiMTD8o",
        authDomain: "test-1aa2a.firebaseapp.com",
        databaseURL: "https://test-1aa2a.firebaseio.com",
        projectId: "test-1aa2a"
    };
    firebase.initializeApp(config);

    var firepadRef = getExampleRef();

    var codeMirror = CodeMirror(document.getElementById('firepad-container'), {
        lineNumbers: true,
        styleActiveLine: true,
        styleActiveSelected: true,
        mode: 'javascript',
        matchTags: {
            bothTags: true
        },
        extraKeys: {
            "Ctrl-J": "toMatchingTag"
        }

    });
    let role = $('#role').val()
    if (role != 'candidate') codeMirror.setOption("readOnly", true);

    var firepad = Firepad.fromCodeMirror(firepadRef, codeMirror, {
        userid: "hellos",
        defaultText: '// JavaScript Editing with Firepad!\nfunction go() {\n  var message = "Hello, world.";\n  console.log(message);\n}'
    });
    var whatMessage;

    $('#run').click(function () {
        console.log(firepad.getText())
        console.log(btoa(firepad.getText()))
        console.log('Time: ' + parseFloat($('#timeLimit').text()).toFixed(2) + " X " + $('#timeLimit').text())
        $.ajax({
            type: "POST",
            url: url + "?base64_encoded=true",
            data: {
                "source_code": btoa(firepad.getText()),
                "language_id": 29,
                "expected_output": btoa($('#sampleOutput').text()),
                "stdin": btoa($('#sampleInput').text()),
                "cpu_time_limit": parseFloat($('#timeLimit').text()).toFixed(2)
            },
            success: function (json) {
                setTimeout(function () {
                    console.log(firepad.getText())
                    console.log(json.token)
                    getResult(json.token)
                    console.log("What " + whatMessage)

                }, 2000)

            },


        })
    });

    $("#submit").click(function () {
        $.ajax({
            type: "POST",
            url: "/submission",
            data: {
                sourceCode: btoa(firepad.getText()),
                _id: $("#_id").val()
            },
            success: function (json) {
                showResult('Test Result', json);
                console.log("JSON " + json);
            }
        })
    })

    function getResult(token) {
        const getUrl = url + "/" + token;
        $.ajax({
            type: "GET",
            url: getUrl,
            success: function (json) {
                console.log('Res: ' + json.status.description)
                showResult('Sample Test Result', json);
                whatMessage = json.status.description;
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log(XMLHttpRequest);
                console.log(textStatus);
                console.log(errorThrown);
                var result;
                result.status.description = textStatus;
                showResult('Sample Test Result', result);
            }

        })
    }

    function showResult(msg, result) {
        $('#result').text(msg + ": " + result.status.description);
    }

    //TODO
    //show excution time and memory


});