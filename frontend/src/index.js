import './scss/style.scss';
import 'bootstrap';
import $ from 'jquery';

// import './js/fondy';

// develop
// const PORT = 8000;
// const SERVER = 'http://localhost';
// prod
const PORT = 8002;
const SERVER = 'http://register.ilac.com.ua';

const URL = `${SERVER}:${PORT}/api/register/`;
const URLlevels = `${SERVER}:${PORT}/api/get/levels`;
const URLlevelPrice = `${SERVER}:${PORT}/api/get/levels/id`;
const URLCenters = `${SERVER}:${PORT}/api/get/centers`;
const URLCities = `${SERVER}:${PORT}/api/get/cities`;
const URLContract = `${SERVER}:${PORT}/api/get/contract/id`;

// for testing localhost
// const URL = 'http://localhost:8000/api/register/';
// const URLlevels = 'http://localhost:8000/api/get/levels';
// const URLlevelPrice = 'http://localhost:8000/api/get/levels/id';
// const URLCenters = 'http://localhost:8000/api/get/centers';
// const URLCities = 'http://localhost:8000/api/get/cities';
// const URLContract = 'http://localhost:8000/api/get/contract/id';

const hideElements = () => {
  $('#formless-success, #formmore-success').hide();
};

const getLevels = () => {
  $.ajax({
    type: 'GET',
    url: URLlevels,
  }).done((res) => {
    console.log(res);
    const selectLevels = $('#levelmore, #levelless');
    $(res).each((e) => {
      selectLevels.append($('<option>').attr('value', res[e].ID).text(res[e].name));
    });
  }).fail((err) => {
    console.log(`fail: ${err}`);
  });
};

const getCentersAll = () => {
  $.ajax({
    type: 'GET',
    url: URLCenters,
  }).done((res) => {
    console.log(res);
    const selectCenters = $('#centermore, #centerless');
    $(res).each((e) => {
      selectCenters.append($('<option>').attr('value', res[e].code).text(`${res[e].name} (${res[e].city})`));
    });
  }).fail((err) => {
    console.log(`fail: ${err}`);
  });
};

const getCities = () => {
  $.ajax({
    type: 'GET',
    url: URLCities,
  }).done((res) => {
    console.log(res);
    const selectCities = $('#citymore, #cityless');
    $(res).each((e) => {
      selectCities.append($('<option>').attr('value', res[e].city).text(`${res[e].city}`));
    });
  }).fail((err) => {
    console.log(`fail: ${err}`);
  });
};

const formInit = () => {
  $('#costmore, #costless').val(0);
  getCities();
  getLevels();
  getCentersAll();
  hideElements();
};


// Example starter JavaScript for disabling form submissions if there are invalid fields
$(document).ready(() => {
  formInit();

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.getElementsByClassName('needs-validation');
  // Loop over them and prevent submission
  // eslint-disable-next-line no-unused-vars
  const validation = Array.prototype.filter.call(forms, (form) => {
    form.addEventListener('submit', (event) => {
      if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    }, false);
  });

  // jquery ajax chain
  const getContractID = (levelID) => $.ajax({ type: 'POST', url: URLlevelPrice, data: { id: levelID } });
  const getContractContent = (level) => $.ajax({ type: 'POST', url: URLContract, data: { id: level.contract_id } });
  const updateContractContent = (contract) => {
    $('.contract').html('Оберіть, будь ласка рівень');
    $('.contract').html(contract.text);
    return contract.ID;
  };
  const updateInputContractForm = (ID) => {
    $('#contractmore').val(ID);
    $('#contractless').val(ID);
  };
  const pasteFullNameMore = () => {
    const name = $('#firstnamemore').val();
    const lastName = $('#lastnamemore').val();
    const temp = $('.contract').html().replace('IVANOV IVAN', `${name} ${lastName}`);
    $('.contract').html(temp);
  };
  const pasteFullNameLess = () => {
    const name = $('#firstnameless').val();
    const lastName = $('#lastnameless').val();
    const temp = $('.contract').html().replace('IVANOV IVAN', `${name} ${lastName}`);
    $('.contract').html(temp);
  };

  $('#levelmore').change((e) => {
    $.ajax({
      type: 'POST',
      url: URLlevelPrice,
      data: {
        id: e.target.value,
      },
    }).done((res) => {
      getContractID(e.target.value)
        .then(getContractContent)
        .then(updateContractContent)
        .then(updateInputContractForm)
        .then(pasteFullNameMore);

      $('#costmore').val(res.price);
    }).fail((err) => {
      console.log(`fail get price: ${err}`);
    });
  });
  $('#levelless').change((e) => {
    $.ajax({
      type: 'POST',
      url: URLlevelPrice,
      data: {
        id: e.target.value,
      },
    }).done((res) => {
      getContractID(e.target.value)
        .then(getContractContent)
        .then(updateContractContent)
        .then(updateInputContractForm)
        .then(pasteFullNameLess);

      $('#costless').val(res.price);
    }).fail((err) => {
      console.log(`fail get price: ${err}`);
    });
  });

  $('#citymore').change((e) => {
    $.ajax({
      type: 'POST',
      url: URLCities,
      data: {
        name: e.target.value,
      },
    }).done((res) => {
      const selectCenters = $('#centermore');
      selectCenters.empty();
      $(res).each((el) => {
        selectCenters.append($('<option>').attr('value', res[el].code).text(`${res[el].name} (${res[el].city})`));
      });
    }).fail((err) => {
      console.log(`fail get cities: ${err}`);
    });
  });
  $('#cityless').change((e) => {
    $.ajax({
      type: 'POST',
      url: URLCities,
      data: {
        name: e.target.value,
      },
    }).done((res) => {
      const selectCenters = $('#centerless');
      selectCenters.empty();
      $(res).each((el) => {
        selectCenters.append($('<option>').attr('value', res[el].code).text(`${res[el].name} (${res[el].city})`));
      });
    }).fail((err) => {
      console.log(`fail get cities: ${err}`);
    });
  });
}, false);

// fondy
// eslint-disable-next-line no-unused-vars
const createOrderLink = (amount, orderDesc) => {
  // eslint-disable-next-line no-undef
  const button = $ipsp.get('button');
  button.setMerchantId(1397120);
  button.setAmount(amount, 'UAH', true);
  button.setResponseUrl('http://www.test.FONDY.eu');
  button.setHost('api.fondy.eu');
  // button.addField({
  //   label: 'Послуга',
  //   name: 'order_desc',
  //   value: orderDesc,
  // });
  return button.getUrl();
};


$('#form-more, #form-less, #testtest').submit((e) => {
  e.preventDefault(); // disallow form which refresh page
  e.stopPropagation();
  const form = $(e.currentTarget); // e.currentTarget use this instead for arrow function
  console.log(form.serialize());

  $.ajax({
    type: 'POST',
    url: URL,
    data: form.serialize(),
  }).done((res) => {
    if (res.status === 'email exist') {
      alert('email exist');
    } else {
      $('#formless-success, #formmore-success, #form-more, #form-less').toggle();
      // добавить кнопку для оплаты (заглушка)
      // const btn = $('<a>', { text: 'Сплатити', href: createOrderLink(1000) });
      // $(btn).appendTo('#paymentmore');
      // $('#paymentless, #paymentmore').append(btn);
      // --добавить кнопку для оплаты (заглушка)--
      // console.log(Object.keys(res));
      $('.number').html(res.student.number);
      $('.firstname, .firstnamemore').html(res.student.name);
      $('.secondname, .secondnamemore').html(res.student.lname);
      $('.email, .emailmore').html(res.student.email);
      $('.phone, .phonemore').html(res.student.phone);
      $('.price, .pricemore').html(res.student.total);
      $('.fee, .feemore').html(res.student.fee);
      $('.total, .totalmore').html(res.student.totalfeesumm);
    }

    // console.log(`success ${res}`);
  }).fail((err) => {
    console.log(`fail: ${err}`);
  });
  e.stopImmediatePropagation(); // dissalow send form twice
  return false;
});
