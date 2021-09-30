import LocomotiveScroll from 'locomotive-scroll';
import i18next from 'i18next';
import gsap from 'gsap';
import axios from 'axios';
import * as yup from 'yup';
import FormMonster from '../../pug/components/form/form';
import SexyInput from '../../pug/components/input/input';

/** ******************************* */
/*
 * smooth scroll start
 */
global.gsap = gsap;
global.axios = axios;

/* eslint-disable-next-line */
const locoScroll = new LocomotiveScroll({
  el: document.querySelector('[data-scroll-container]'),
  smooth: true,
  lerp: 0.05,
  smoothMobile: false,
  inertia: 1.1,
});
locoScroll.destroy();
global.locoScroll = locoScroll;
/*
 * smooth scroll end
 */
/** ******************************* */
/** ******************************* */
/*
 * form handlers start
 */


const formsWithTel = ['[data-home-communication]'];

formsWithTel.forEach(form => {
  const $form = document.querySelector(form);
  console.log(form);
  if ($form) {
    /* eslint-disable */
    new FormMonster({
      /* eslint-enable */
      elements: {
        $form,
        showSuccessMessage: false,
        successAction: () => {
          window.location.href = 'message';
        },
        $btnSubmit: $form.querySelector('[data-btn-submit]'),
        fields: {
          // name: {
          //   inputWrapper: new SexyInput({ animation: 'none', $field: $form.querySelector('[data-field-name]') }),
          //   rule: yup.string().required(i18next.t('required')).trim(),
          //   defaultMessage: i18next.t('name'),
          //   valid: false,
          //   error: [],
          // },

          phone: {
            inputWrapper: new SexyInput({
              animation: 'none',
              $field: $form.querySelector('[data-field-phone]'),
              typeInput: 'phone',
            }),
            rule: yup
              .string()
              .required(i18next.t('required'))
              .min(16, i18next.t('field_too_short', { cnt: 19 - 7 })),

            defaultMessage: i18next.t('phone'),
            valid: false,
            error: [],
          },
        },
      },
    });
    // $form.querySelector('.js-mask-absolute').addEventListener('click', () => {
    //   $form.querySelector('[name="phone"]').focus();
    // }, false);
  }
});


/*
 * form handlers end
 */
function disableScroll() {
  const containersScroll = document.querySelectorAll('[data-disable-page-scroll]');
  containersScroll.forEach(block => {
    block.addEventListener('mouseenter', () => {
      // locoScroll.stop();
    });
    block.addEventListener('mouseleave', () => {
      // locoScroll.start();
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  disableScroll();
  window.locoScroll.update();
});
/** ******************************* */
