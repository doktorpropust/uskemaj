window.jsPDF = window.jspdf.jsPDF;

let data = {
  fullName: "",
  dateOfBirth: "",
  currentDate: "",
  labNumber: Math.floor(Math.random() * 90000) + 10000,
};

let checkForErrors = function () {
  let err = "";

  if (!data.fullName) err += "Ime je obavezno\n";

  if (!data.dateOfBirth) err += "Datum rodenja je obavezan\n";
  else if (!moment(data.dateOfBirth, "DD.MM.YYYY", true).isValid())
    err += "Krivi format datuma rodenja\n";

  if (
    !!data.currentDate &&
    !moment(data.dateOfBirth, "DD.MM.YYYY", true).isValid()
  )
    err += "Krivi format datuma testa.\n";

  return err;
};

window.onload = function () {
  datepicker("#dateOfBirth", {
    formatter: (input, date) => {
      const value = moment(date).format("DD.MM.YYYY")
      input.value = value;
      data.dateOfBirth = value;
    },
  });

  datepicker("#currentDate", {
    formatter: (input, date) => {
      const value = moment(date).format("DD.MM.YYYY")
      input.value = value;
      data.currentDate = value;
    },
  });

  inputs = document.getElementsByClassName("input-field");

  for (let i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener(
      "change",
      function (event) {
        data[event.target.name] = event.target.value;
      },
      false
    );
  }

  form = document.getElementById("form");
  form.addEventListener(
    "submit",
    function (event) {
      event.preventDefault();
      let errors = checkForErrors();
      if (!!errors) {
        alert(errors);
        return;
      }

      let canvas = document.createElement("canvas");
      document.body.appendChild(canvas);
      canvas.classList.add("canvas");
      let context = canvas.getContext("2d");
      let imageObj = new Image();
      imageObj.src = "./img.jpg";
      imageObj.setAttribute("crossorigin", "anonymous");
      imageObj.onload = function () {
        let imgWidth = imageObj.width;
        let imgHeight = imageObj.height;
        canvas.width = imgWidth;
        canvas.height = imgHeight;
        context.drawImage(imageObj, 0, 0, imgWidth, imgHeight);

        //NAME
        context.font = "bold 41px Arial";
        context.fillText(data.fullName.toUpperCase(), 439, 416);
        let nameWidth = context.measureText(data.fullName.toUpperCase()).width;
        context.font = "normal 41px Arial";

        let dateOfBirth = moment(data.dateOfBirth, "DD.MM.YYYY", true).format(
          ", DD.MM.YYYY."
        );
        context.fillText(dateOfBirth, 460 + nameWidth, 416);

        //LAB NUMBER
        context.fillText(data.labNumber, 440, 510);

        //DATES
        let currentDate =
          (data.currentDate &&
            moment(data.currentDate, "DD.MM.YYYY", true).format(
              "DD.MM.YYYY."
            )) ||
          moment().format("DD.MM.YYYY.");
        context.fillText(currentDate, 2198, 96);
        context.fillText(currentDate, 2198, 144);

        let imgData = canvas.toDataURL("image/jpeg", 1.0);
        let pdf = new jsPDF("p", "mm", "a4");

        let pdfWidth = pdf.internal.pageSize.getWidth();
        let pdfHeight = pdf.internal.pageSize.getHeight();

        pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
        window.open(pdf.output("bloburl"), "_self");
        canvas.remove();
      };
    },
    false
  );
};
