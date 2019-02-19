$(document).ready(function () {
	//make connection
	var socket = io.connect('192.168.1.189:3000');
	var message = $('#message');
	var send_message = $('#btn');
	var feedback = $('#feedback');
	const userName = $('#userName').val() || 'as';
	const roomId = getUrlParameter('room');
	let role = $('#role').val() || 'candidate';

	const setter = $('#setter').val();
	if (userName == setter) role = 'Problem Setter';
	addUserToRoom();
	socket.userName = userName;
	console.log("Name soc:" + socket.userName);
	socket.emit('create', {
		room: roomId,
		userRole: role,
		userName: userName
	});
	if (role != 'candidate') {
		$("#submit").hide();
		$("#run").hide();

	}
	loadMessages(roomId);
	//loadUsers(roomId);
	//Emit message
	$("#logout").click(function () {
		$(window).attr("location", "/logout");
	})
	socket.on('private', (data) => {
		console.log(data.setterName);
	})
	send_message.click(function () {
		socket.emit('new_message', {
			message: message.val(),
			userName: userName || 'Unknown',
			room: roomId,
			userRole: role
		});
	});


	socket.on('user_has_become_online', (data) => {
		//alert("Online here: " + data.userName);
		if (checkIfUserAvailable(data.userName) == 1) {
			makeUserActive(data.userName);
			return;
		}
		if (data.userRole == 'candidate') {
			createActiveUserForCandidateOrProblemSetter(data.userName, 'active-user', 'Candidate');
			return;
		}
		createActiveUser(data.userName);

	});

	socket.on('user_has_become_offline', (data) => {
		makeUserInactive(data.userName);
	})

	socket.on('new_message', (data) => {
		feedback.html('');
		message.val('');
		$('#temp').before(addMessage(data.userName, data.userRole, data.message));
	});

	socket.on('result', (data) => {

		$('#temp').before(addSpecialMessage(data.userName, getRole(data.userName, data.userRole), data.message));
	});


	$("body").on('DOMSubtreeModified', "#result", function () {
		if ($('#result').text() == "") return;
		socket.emit('result', {
			message: $('#result').text(),
			userName: userName,
			room: roomId,
			userRole: role
		});
	});


	function getUrlParameter(sParam) {
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

	function getRole(name, role) {
		if (name == setter) {
			return 'problem-setter';
		}
		return role;
	}

	function roleVsCSS(role) {
		if (role == 'candidate') return 'candidate-user';
		else if (role == 'admin') return 'other-user';
		return 'setter-user';
	}

	function addMessage(username, role, chatMessage) {
		let name =
			'<div class =' + roleVsCSS(role) + '>' +
			'<h5> &nbsp;' + username + '</h5>' +
			'<pre>' + chatMessage + '</pre>' +
			'</div><br>';
		return name;
	}

	function addSpecialMessage(username, role, resultMessage) {
		let name =
			'<div class =' + roleVsCSS(role) + '>' +
			'<h5> &nbsp;' + username + ' has made an submission</h5>' +
			'<pre>' + resultMessage + '</pre>' +
			'</div><br>';
		return name;
	}

	function loadMessages(roomId) {
		$.ajax({
			type: 'GET',
			url: '/room/' + roomId + "/messages",
			success: function (msg) {
				msg.slice().reverse().forEach((data) => {
					$('#temp').before(addMessage(data.userName, data.userRole, data.message));
				});
			},
			error: function (e) {
				alert('Error: ' + JSON.stringify(e));
			}
		});
	}
	//TODO
	function loadUsers(roomId) {
		$.ajax({
			type: 'GET',
			url: '/room/' + roomId + "/users",
			success: function (msg) {
				console.log("USERS: " + msg)
				initialUsersInRoom(msg);
			},
			error: function (e) {
				alert('Error: ' + JSON.stringify(e));
			}
		});
	}

	function isItMe(user) {
		if (user == userName) return true;
		return false;
	}

	function checkIfUserAvailable(activeUserName) {
		var all = $(':first-child', $(".user"));
		let flag = 0;
		for (let i = 0; i < all.length; i++) {
			const secondChild = $(all.eq(i)).next();
			console.log("FLAG: " + flag);
			if ($(secondChild).text() == activeUserName) {
				flag = 1;
				$(all.eq(i)).removeClass('inactive-user');
				$(all.eq(i)).addClass('active-user');
				break;
			}
		}
		return flag;
	}

	function makeUserActive(activeUserName) {
		var all = $(':first-child', $(".user"));
		for (let i = 0; i < all.length; i++) {
			const secondChild = $(all.eq(i)).next();
			if ($(secondChild).text() == activeUserName) {
				$(all.eq(i)).removeClass('inactive-user');
				$(all.eq(i)).addClass('active-user');
				break;
			}
		}
		console.log($("#show-users").children())
	}

	function createActiveUser(activeUserName) {
		$('#show-users').append('<div class = "user">' +
			'<span class = "active-user"> </span>&nbsp;&nbsp;&nbsp' +
			'<span>' + activeUserName + '</span>' +
			'</div>');
	}

	function createActiveOrInactiveUser(activeUserName, status) {
		$('#show-users').append('<div class = "user">' +
			'<span class =' + status + '> </span>&nbsp;&nbsp;&nbsp' +
			'<span>' + activeUserName + '</span>' +
			'</div>');
	}

	function createActiveUserForCandidateOrProblemSetter(activeUserName, status, userRole) {
		let temp;

		if (userRole == 'Candidate') {
			temp = $('#show-users');
			$(temp).prepend(getUser(status, activeUserName, userRole));
		} else {
			temp = $('#show-users');
			$(temp).prepend(getUser(status, activeUserName, userRole));
		}
	}

	function getUser(status, activeUserName, userRole) {
		return '<div class = "user">' +
			'<span class =' + status + '> </span>&nbsp;&nbsp;&nbsp' +
			'<span>' + activeUserName + '</span>' +
			'<span> &nbsp;&nbsp;' + '(' + userRole + ')' + '</span>' +
			'</div>';
	}

	function initialUsersInRoom(data) {
		if (data.setterName) {
			createActiveUserForCandidateOrProblemSetter(data.setterName, data.setterStatus, 'Problem Setter');
		}
		if (data.candidateName) {
			createActiveUserForCandidateOrProblemSetter(data.candidateName, data.candidateStatus, 'Candidate');
		}
		data.collaborator.forEach(function (user) {
			createActiveOrInactiveUser(user.name, user.status);
		})
	}

	function makeUserInactive(inactiveUserName) {
		var all = $(':first-child', $(".user"));
		console.log("Inactive: " + inactiveUserName);
		for (let i = 0; i < all.length; i++) {
			const secondChild = $(all.eq(i)).next();
			console.log('Child: ' + $(secondChild).text())
			if ($(secondChild).text() == inactiveUserName) {
				$(all.eq(i)).addClass('inactive-user');
				$(all.eq(i)).removeClass('active-user');
				console.log("Done");
				return;
			}
		}
	}

	function addUserToRoom() {
		$.ajax({
			type: 'PUT',
			url: '/users/' + userName + "/rooms",
			data: {
				roomId: roomId
			},
			success: function (msg) {
				console.log(msg);
			},
			error: function (e) {
				alert('Error: ' + JSON.stringify(e));
			}
		});
	}
});