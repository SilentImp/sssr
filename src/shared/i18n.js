import i18next from 'i18next';
import XHR from 'i18next-xhr-backend';
import Cache from 'i18next-localstorage-cache';
import LanguageDetector from 'i18next-browser-languagedetector';
import sprintf from 'i18next-sprintf-postprocessor';

i18next
  .use(XHR)
  .use(Cache)
  .use(LanguageDetector)
  .use(sprintf)
  .init({
    overloadTranslationOptionHandler: sprintf.overloadTranslationOptionHandler,
    detection: {
      lookupQuerystring: 'lang',
    },
    ns: ['translation'],
    load: 'languageOnly',
    wait: false,
    debug: false,
    keySeparator: '-___-',
    nsSeparator: '-____-',
    pluralSeparator: '##',
    contextSeparator: '::',
    resources: {
      en: {
        translation: {
          'Do not reply': 'Do not reply',
          Reply: 'Reply',
          'Cart with <b>{{count}}</b> for <b>{{price}}</b>::wide': 'Cart with <b>{{count}}</b> for <b>{{price}}</b>',
          'Cart with <b>{{count}}</b> for <b>{{price}}</b>::short': '<b>{{count}}</b> for <b>{{price}}</b>',
          Cart: 'Cart',
          '{{count}} review for this product': '{{count}} review for this product',
          '{{count}} review for this product##plural': '{{count}} reviews for this product',
          '{{count}} comment to this product': '{{count}} comment to this product',
          '{{count}} comment to this product##plural': '{{count}} comments to this product',
          'View {{count}} answer': 'View {{count}} answer',
          'View {{count}} answers##plural': 'Hide {{count}} answers',
          'Hide {{count}} answer': 'Hide {{count}} answer',
          'Hide {{count}} answers##plural': 'Hide {{count}} answers',
          '{{count}} product update': '{{count}} Product update',
          '{{count}} product update##plural': '{{count}} Product updates',
        },
      },
      ru: {
        translation: {
          'Do not reply': 'Не отвечать',
          Reply: 'Ответить',
          'Cart with <b>{{count}}</b> for <b>{{price}}</b>::wide': 'В корзине <b>{{count}}</b> за <b>{{price}}</b>',
          'Cart with <b>{{count}}</b> for <b>{{price}}</b>::short': '<b>{{count}}</b> за <b>{{price}}</b>',
          Cart: 'Корзина',
          '{{count}} review for this product': '{{count}} отзыв о продукте',
          '{{count}} review for this product##0': '{{count}} отзыв о продукте',
          '{{count}} review for this product##1': '{{count}} отзыва о продукте',
          '{{count}} review for this product##2': '{{count}} отзывов о продукте',
          '{{count}} comment to this product': '{{count}} комментарий к продукту',
          '{{count}} comment to this product##0': '{{count}} комментарий к продукту',
          '{{count}} comment to this product##1': '{{count}} комментария к продукту',
          '{{count}} comment to this product##2': '{{count}} комментариев к продукту',
          'View {{count}} answer': 'Просмотреть {{count}} ответ',
          'View {{count}} answer##0': 'Просмотреть {{count}} ответ',
          'View {{count}} answer##1': 'Просмотреть {{count}} ответа',
          'View {{count}} answer##2': 'Просмотреть {{count}} ответов',
          'Hide {{count}} answer': 'Спрятать {{count}} ответ',
          'Hide {{count}} answer##0': 'Спрятать {{count}} ответ',
          'Hide {{count}} answer##1': 'Спрятать {{count}} ответа',
          'Hide {{count}} answer##2': 'Спрятать {{count}} ответов',
          '{{count}} product update': '{{count}} product update',
          '{{count}} product update##0': '{{count}} Обновление продукта',
          '{{count}} product update##1': '{{count}} Обновления продукта',
          '{{count}} product update##2': '{{count}} Обновлений продукта',
        },
      },
    },
  });

export default i18next;
