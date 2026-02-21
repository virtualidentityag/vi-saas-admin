import i18next from 'i18next';

export type Languages = 'de' | 'en' | 'fr';

const changeLang = (lang: Languages) => {
    i18next.changeLanguage(lang);
};

export default changeLang;
