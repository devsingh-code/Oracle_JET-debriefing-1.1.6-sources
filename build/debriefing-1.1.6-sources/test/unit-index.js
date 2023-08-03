requirejs([
    '/base/test/unit/app-controller',
    '/base/test/unit/ofsc-connector',
    '/base/test/unit/models/part-model',
    '/base/test/unit/viewModels/add-expense',
    '/base/test/unit/viewModels/add-labor',
    '/base/test/unit/viewModels/invoice',
    '/base/test/unit/viewModels/add-returned-part',
    '/base/test/unit/viewModels/add-used-part',
    '/base/test/unit/viewModels/dashboard',
    '/base/test/unit/services/inventory-search-service',
    '/base/test/unit/models/catalog-model',
    '/base/test/unit/models/catalog-collection',
    '/base/test/unit/models/abstract-model',
    '/base/test/unit/models/abstract-collection',
    '/base/test/unit/data-services/parts-catalog-data-service',
    '/base/test/unit/components/part-preview-component/part-preview-component',
     '/base/test/unit/utils/ko-text-highlighted-binding',
    '/base/test/unit/utils/signature'

], () => {
    window.__karma__.start();
});
