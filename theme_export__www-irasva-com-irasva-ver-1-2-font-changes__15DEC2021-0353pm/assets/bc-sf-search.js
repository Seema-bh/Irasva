// Override Settings
var bcSfSearchSettings = {
  search: {
    suggestionPosition: 'right'
  }
};

// Customize style of Suggestion box
BCSfFilter.prototype.customizeSuggestion = function(suggestionElement, searchElement, searchBoxId) {};

BCSfFilter.prototype.buildSuggestionProductPrice = function(data) {
    /* Multi-currency Shopify */
    var self = this;
    self.prepareSuggestionProductPriceData(data);
    
    // Check on sale
    var onSale = data.compare_at_price_max > data.price_max;
    // Format price
    var price = this.formatMoney(data.price_max * 100),
        compareAtPrice = this.formatMoney(data.compare_at_price_max * 100);
    if (this.getSettingValue('search.removePriceDecimal')) {
        price = this.removeDecimal(price);
        compareAtPrice = this.removeDecimal(compareAtPrice);
    }
    // Build Price
    var result = '';
    if (this.getSettingValue('search.showSuggestionProductPrice')) {
        result += '<div class="' + this.class.searchSuggestion + '-product-price">';
        if (onSale && this.getSettingValue('search.showSuggestionProductSalePrice')) {
            result += '<s>' + compareAtPrice + '</s>  ';
            result += '<span class="bc-sf-product-sale-price">' + price + '</span>';
        } else {
            result += '<span class="bc-sf-product-regular-price">' + price + '</span>';
        }
        result += '</div>';
    }
    return result;
};