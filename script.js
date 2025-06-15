var video = document.getElementById('video');
var button = document.getElementById('capture-btn');
var photoContainer = document.getElementById('photos');
// var timeInput = 5;
var timeInput = document.getElementById('Time');
var photoCount = 4;  //nhớ adjust
var countDiv = document.getElementById('countdownnum');


// Request access to the webcam  
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {  // make sure browser support getUserMedia (nhiều browser ko support như Block camera hay trang ẩn danh))
    navigator.mediaDevices.getUserMedia({ video: true })  // yêu cầu quyền truy cập camera
        .then(
            function (stream) {                    //nếu cho phép thì getUserMedia trả về stream
                video.srcObject = stream;  //.srcObj: thay vì src thì gán luồng stream vào video
                video.play();
            }
        )
        .catch(function (err) {                      //nếu không cho phép, thì getUserMedia sẽ trả về err
            console.error("Error accessing webcam: " + err);
            alert("Your browser does not support accessing the webcam.");
        });
}
// navigator: đối tượng cung cấp bởi Browser để truy cập các thiết bị phần cứng (vd: webcam, microphone))


// Capture button 
button.addEventListener("click", () => {
    var timer = parseInt(timeInput.value);

    let numberPhoto = parseInt(photoCount);
    if (numberPhoto >= 1) {
        if (timer > 0) {
            button.disabled = true;
            let countdown = setInterval(() => {
                console.log(timer);
                countDiv.style.display = "block";
                countDiv.innerHTML = timer;
                timer--;
                if (timer < 0) {
                    clearInterval(countdown);
                    startShooting(numberPhoto);
                }
            }, 1000);

        } else {
            startShooting(numberPhoto);
        }
    } else {
        alert("Vui lòng chọn số lượng ảnh.");
    }
    if (photoCount > 0) {
        document.querySelector('.container').classList.add('grid-layout');
    }


});
//setInterval(function, delay): hàm sẽ gọi là hàm function sau mỗi khoảng time delay tính bằng mili giây
//clearInterval(interval): dừng hàm setInterval đã được gọi trước đó, làm bên trong làm setInterval  => không dừng thì sẽ lặp mãi mãi


function startShooting(numberPhoto) {
    let shotsTaken = 0;
    button.disabled = true;

    function takeAndCountdown() {
        if (shotsTaken >= numberPhoto) {
            countDiv.style.display = "none";
            button.disabled = false;
            //  window.location.href = "result.html";
            return;
        }

        if (shotsTaken > 0) {
            // Bắt đầu đếm ngược trước mỗi lần chụp (trừ ảnh đầu tiên)
            let timer = timeInput.value;
            countDiv.style.display = "block";
            countDiv.innerHTML = timer;

            let countdown = setInterval(() => {
                timer--;
                if (timer > 0) {
                    countDiv.innerHTML = timer;
                } else {
                    clearInterval(countdown);
                    countDiv.innerHTML = "📸";
                    setTimeout(() => {
                        takePicture();
                        shotsTaken++;
                        takeAndCountdown(); // gọi lại cho lần tiếp theo
                    }, 500); // delay nhỏ để hiển thị biểu tượng "📸" rồi chụp
                }
            }, 1000);
        } else {
            // Ảnh đầu tiên chụp ngay
            takePicture();
            shotsTaken++;
            takeAndCountdown(); // tiếp tục với ảnh thứ 2
        }
    }

    takeAndCountdown(); // bắt đầu quá trình
}


var capturedImages = [];
// Function to take a picture
function takePicture() {
    var canvas = document.createElement('canvas'); // Tạo một canvas mới để vẽ hình ảnh
    var context = canvas.getContext('2d');  // xác định vẽ 2D hay 3D lên canvas
    canvas.width = video.videoWidth; // Đặt kích thước của canvas bằng kích thước video
    canvas.height = video.videoHeight;

    context.drawImage(video, 0, 0, canvas.width, canvas.height); // Vẽ hình ảnh từ video lên canvas
    var dataURL = canvas.toDataURL('image/jpeg'); // chuyển canvas thành ảnh

    var photoDiv = document.createElement('div'); // Tạo một div mới để chứa ảnh
    photoDiv.className = 'photo'; // Thêm class cho div

    var img = document.createElement('img'); // Tạo một thẻ img mới
    img.src = dataURL; // Đặt nguồn hình ảnh từ dữ liệu canvas
    photoDiv.appendChild(img); // Thêm thẻ img vào div
    photoContainer.appendChild(photoDiv); // Thêm div chứa ảnh vào container


    // sau khi chụp => lưu ảnh vào mảng

    capturedImages.push(dataURL);
    if (capturedImages.length === photoCount) {
        console.log(JSON.stringify(capturedImages).length / 1024, 'KB');
        localStorage.removeItem('photos');
        localStorage.setItem('photos', JSON.stringify(capturedImages));
        window.location.href = 'result.html';
    }
}

