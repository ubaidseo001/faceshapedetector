// Define the onOpenCvReady function
function onOpenCvReady() {
    // Load the image
    let imgElement = document.getElementById('img-upload');
    let mat = cv.imread(imgElement);

    // Convert the image to grayscale
    let gray = new cv.Mat();
    cv.cvtColor(mat, gray, cv.COLOR_RGBA2GRAY, 0);

    // Detect faces
    let faceCascade = new cv.CascadeClassifier();
    faceCascade.load('/faceshapedetector/haarcascade_frontalface_default.xml');
    let faces = new cv.RectVector();
    let msize = new cv.Size(0, 0);
    faceCascade.detectMultiScale(gray, faces, 1.1, 3, 0, msize, msize);

    // Draw rectangles around the faces
    for (let i = 0; i < faces.size(); ++i) {
        let face = faces.get(i);
        let point1 = new cv.Point(face.x, face.y);
        let point2 = new cv.Point(face.x + face.width, face.y + face.height);
        cv.rectangle(mat, point1, point2, [255, 0, 0, 255]);
    }

    // Display the result
    cv.imshow('canvasOutput', mat);

    // Clean up
    gray.delete();
    faces.delete();
    mat.delete();
}

// Load OpenCV.js
cv['onRuntimeInitialized'] = onOpenCvReady;

// Load OpenCV.js
cv['onRuntimeInitialized'] = () => {
    // Load the image
    let imgElement = document.getElementById('img-upload');
    let mat = cv.imread(imgElement);

    // Convert the image to grayscale
    let gray = new cv.Mat();
    cv.cvtColor(mat, gray, cv.COLOR_RGBA2GRAY, 0);

    // Detect faces
    let faceCascade = new cv.CascadeClassifier();
    faceCascade.load('haarcascade_frontalface_default.xml');
    let faces = new cv.RectVector();
    let msize = new cv.Size(0, 0);
    faceCascade.detectMultiScale(gray, faces, 1.1, 3, 0, msize, msize);

    // Draw rectangles around the faces
    for (let i = 0; i < faces.size(); ++i) {
        let face = faces.get(i);
        let point1 = new cv.Point(face.x, face.y);
        let point2 = new cv.Point(face.x + face.width, face.y + face.height);
        cv.rectangle(mat, point1, point2, [255, 0, 0, 255]);
    }

    // Display the result
    cv.imshow('canvasOutput', mat);

    // Clean up
    gray.delete();
    faces.delete();
    mat.delete();
};

// sand form image into the server
function sanDer(formData) {
    var token = document.querySelector('[name=csrfmiddlewaretoken]').value;
    document.getElementById("rs").innerHTML = "Processing...";
    var params = {
        method: "POST",
        headers: new Headers({
            "X-CSRFToken": token,
        }),
        body: (formData)
    }
    let spinner = document.getElementById("spinner")
    let img = document.getElementById("img-upload")
    spinner.classList.add("spinner")
    img.classList.add("img_opacity")
    fetch('/?request_type=first', params)
        .then((response) => response.json())
        .then((result) => {
            document.getElementById("rs").innerHTML = result.file;

            spinner.classList.remove("spinner")
            img.classList.remove("img_opacity")
            let btn = document.getElementById("bt")
            btn.innerText = "Try another image"
            btn.classList.add("sub")
            btn.onclick = null
            btn.onclick = inputDivClick
        })
        .catch((error) => {
            console.error('Error:', error);
            document.getElementById("rs").innerHTML = "Try a different image";
            spinner.classList.remove("spinner")
            img.classList.remove("img_opacity")

        });
}

// form validation 
function validateForm() {
    const formData = new FormData();
    const fileField = document.querySelector('input[type="file"]');
    var requard_size_kb = 200
    if (fileField.files[0]) {
        if (fileField.files[0].type.startsWith('image/')) {
            var input_image_size = fileField.files[0].size / 1024;
            if (input_image_size > requard_size_kb) {
                var promess = resizedImg(fileField.files[0])
                    .then((compressed_image) => {
                        formData.append("file", compressed_image)
                        sanDer(formData)
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    });

            }
            else {
                formData.append("file", fileField.files[0])
                sanDer(formData)
            }

        }
    }
    else {
        document.getElementById("rs").innerHTML = "please select new image ";
    }
}
// button to clik input tage
function inputDivClick() {
    let inputDiv = document.querySelector('.drop-zone__input')
    inputDiv.click()
}


// compress image if image biger
function resizedImg(image_file) {
    let maxSize = 500;
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.readAsDataURL(image_file);
        reader.onload = (event) => {
            let image_url = event.target.result;
            let image = document.createElement('img');
            image.src = image_url;
            image.onload = (e) => {
                let canvas = document.createElement('canvas');
                let width = image.width;
                let height = image.height;
                if (width > height) {
                    if (width > maxSize) {
                        height *= maxSize / width;
                        width = maxSize;
                    }
                } else {
                    if (height > maxSize) {
                        width *= maxSize / height;
                        height = maxSize;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                let context = canvas.getContext('2d');
                context.drawImage(image, 0, 0, canvas.width, canvas.height);
                let url = canvas.toDataURL('image/jpeg', 98);
                let arr = url.split(",")
                let mime = arr[0].match(/:(.*?);/)[1]
                let data = arr[1]

                let dataStr = atob(data)
                let n = dataStr.length
                let dataArr = new Uint8Array(n)

                while (n--) {
                    dataArr[n] = dataStr.charCodeAt(n)
                }

                let file = new File([dataArr], 'File.jpg', { type: mime })
                resolve(file);
            };
        };
        reader.onerror = (error) => {
            reject(error);
        };
    });
}



let btn = document.getElementById("bt")
btn.onclick = inputDivClick
if (window.innerWidth > 800) {
    document.getElementById("preview-text").innerText = "Drop file hare or click to upload"
    bt
}



if (document.body.contains(document.querySelector('.drop-zone__input'))) {

    const inputDiv = document.querySelector('.drop-zone__input');
    const dropItemDiv = document.querySelector('.drop-zone');


    dropItemDiv.addEventListener('dragover', e => {
        e.preventDefault();
        dropItemDiv.classList.add('drop-zone__over');
        document.querySelector("#img-upload").style.border = ("4px dashed rgb(61, 84, 104)");

    });
    ['dragleave', 'dragend'].forEach(type => {
        dropItemDiv.addEventListener(type, e => {
            dropItemDiv.classList.remove('drop-zone__over');
            document.querySelector("#img-upload").style.border = ("none");
        });
    });

    dropItemDiv.addEventListener('click', e => {
        inputDiv.click();
    });
    inputDiv.addEventListener('change', e => {
        if (inputDiv.files.length) {
            preview(dropItemDiv, inputDiv.files[0]);
        }
    });

    dropItemDiv.addEventListener('drop', e => {
        e.preventDefault();

        if (e.dataTransfer.files.length) {
            const file = e.dataTransfer.files[0];
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);

            inputDiv.files = dataTransfer.files;
            preview(dropItemDiv, file);
        };

        document.querySelector("#img-upload").style.border = ("none");

    });

    function preview(dropItemms, file) {
        const preview = dropItemms.querySelector('#img-upload');
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.addEventListener("load", function () {
                let btn = document.getElementById("bt")
                btn.onclick = null
                btn.classList.remove("sub")
                btn.innerText = "Send Image"
                btn.onclick = validateForm
                document.getElementById("rs").innerHTML = null
                


                // Create a new Image object
                var img = new Image();

                preview.src = reader.result; // show image in <img> tag
                img.src = reader.result;

            }, false);
            if (file) {
                reader.readAsDataURL(file);
            }


            //remove some classes
            let img_preview = document.querySelector("#img-upload")
            if (img_preview.classList.contains("drop-zone__preview")) {
                img_preview.classList.remove("drop-zone__preview");
            };

            dropItemms.querySelector(".drop-zone__prompt").style.display = 'none';


            document.querySelector('.drop-zone').style.border = 'none';
            document.querySelector('.drop-zone').style.background = 'none';
            if (document.querySelector('.drop-zone').classList.contains("dark-theme")){
                document.querySelector('.drop-zone').classList.remove("dark-theme")
                
            }
        }
        else {
            document.getElementById("rs").innerHTML = "please select image file "
        }



    };
};
