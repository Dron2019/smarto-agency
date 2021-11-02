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
          const tl = gsap.timeline({paused: true})
            .set('[data-thank-page]', { display: 'block' })
            .fromTo('[data-thank-page]', { autoAlpha: 0 }, { autoAlpha: 1 });
            tl.play();
            document.querySelector('.thanks-form__close').onclick = () => {
              tl.reverse();
          }
        },
        $btnSubmit: $form.querySelector('[data-btn-submit]'),
        fields: {
          name: {
            inputWrapper: new SexyInput({ animation: 'none', $field: $form.querySelector('[data-field-name]') }),
            rule: yup.string().required(i18next.t('required')).trim(),
            defaultMessage: i18next.t('name'),
            valid: false,
            error: [],
          },
          text: {
            inputWrapper: new SexyInput({ animation: 'none', $field: $form.querySelector('[data-field-text]') }),
            rule: yup.string().required(i18next.t('required')).trim(),
            defaultMessage: i18next.t('name'),
            valid: false,
            error: [],
          },

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

/** ******************************* */

console.log('i here');