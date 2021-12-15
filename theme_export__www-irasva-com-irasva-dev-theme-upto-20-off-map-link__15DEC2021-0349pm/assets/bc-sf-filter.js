// Override Settings
var bcSfFilterSettings = {
    general: {
        limit: bcSfFilterConfig.custom.products_per_page,
        // Optional
        loadProductFirst: false,
      	priceMode: 'max'
    },
};

var bcSfFilterTemplate = {
    'gridBorderClass': 'grid-item-border',
    'onSaleClass': 'on-sale',
    'soldOutClass': 'sold-out',

    'quickViewHtml': '<a class="quickview-button" href="javascript:void(0)" id="{{itemHandle}}" title="' + bcSfFilterConfig.label.quick_view + '"><span>' + bcSfFilterConfig.label.quick_view + '</span></a>',
    'reviewHtml': '<span class="shopify-product-reviews-badge" data-id="{{itemId}}"></span>',

    // Grid Template
    'productGridItemHtml': '<div class="grid-item col-xs-6 ' + bcSfFilterConfig.custom.grid_item_width + ' {{itemGridBorderClass}} {{itemCropImageClass}} abc">' +
                                '<div class="inner product-item {{itemSoldOutClass}} {{itemSaleClass}} wow fadeIn" data-wow-delay="{{delayTime}}ms" id="product-{{itemId}}">' +
                                    '<div class="inner-top">' +
                                        '<div class="product-top">' +
                                            '<div class="product-image {{itemFlipImageLabel}}" data-collections-related="{{itemCollectionRelated}}">' +
                                                '<a href="{{itemUrl}}" class="product-grid-image" data-collections-related="{{itemCollectionRelated}}">' +
                                                    '<img src="{{itemThumbUrl}}" alt="{{itemTitle}}" class="{{itemImageClass}}">' +
                                                    '{{itemImageTwo}}' +
                                                '</a>' +
                                            '</div>' +
                                            '{{itemLabels}}' +
                                            '<div class="product-des abs-center">' +
                                                '{{itemWishlist}}' +
                                                '{{itemAddToCart}}' +
                                            '</div>' +
                                            '<div class="product-des abs-bottom">' +
                                                '{{itemSizeSwatches}}' +
                                                '{{itemQuickView}}' +
                                            '</div>' +
                                        '</div>' +
                                        // Product Bottom
                                        '<div class="product-bottom">' +
                                            '{{itemVendor}}' +
                                            '<a class="product-title" href="{{itemUrl}}">{{itemTitle}}</a>' +
                                            '{{itemReview}}' +
                                            '<div class="price-box">{{itemPrice}}</div>' +
                                            '<a href="{{itemUrl}}" style="text-decoration: none;"></a>' +
                                            '{{itemColorSwatches}}' +
                                        '</div>' +
                                        // Product Detail
                                        '<div class="product-details">' +
                                            '{{itemVendor}}' +
                                            '<a class="product-title" href="{{itemUrl}}">{{itemTitle}}</a>' +
                                            '{{itemReview}}' +
                                            '<div class="short-description">{{itemDescription}}</div>' +
                                            '<div class="price-box">{{itemPrice}}</div>' +
                                            '{{itemColorSwatches}}' +
                                            '<div class="action">{{itemAddToCart}}</div>' +
                                             '{{itemWishlist}}' +
                                        '</div>' +
                                        // End Product Detail
                                    '</div>' +
                                '</div>' +
                            '</div>',

    // List Template
    'productListItemHtml':  '<div class="grid-item product-item {{itemSoldOutClass}} {{itemSaleClass}} wow fadeIn" data-wow-delay="{{delayTime}}ms" id="product-{{itemId}}">' +
                                '<div class="product-image">' +
                                    '<a href="{{itemUrl}}" class="product-list-thumb product-grid-image">' +
                                        '<img src="{{itemThumbUrl}}" alt="{{itemTitle}}">' +
                                    '</a>' +
                                    '{{itemLabels}}' +
                                '</div>' +

                                '<div class="product-details">' +
                                    '<a class="product-title" href="{{itemUrl}}">{{itemTitle}}</a>' +
                                    '{{itemVendor}}' +
                                    '{{itemReview}}' +
                                    '<div class="short-description">{{itemDescription}}</div>' +
                                    '{{itemColorSwatches}}' +
                                    '<div class="price-box">{{itemPrice}}</div>' +
                                    '<div class="action">{{itemAddToCart}}</div>' +
                                    '{{itemWishlist}}' +
                                '</div>' +
                            '</div>',

    // Pagination Template
    'previousActiveHtml': '<li class="text"><a href="{{itemUrl}}" title="' + bcSfFilterConfig.label.toolbar_previous + '"><i class="fa fa-angle-left" aria-hidden="true"></i><span>' + bcSfFilterConfig.label.toolbar_previous + '</span></a></li>',
    'previousDisabledHtml': '<li class="disabled"><i class="fa fa-angle-left" aria-hidden="true"></i><span>' + bcSfFilterConfig.label.toolbar_previous + '</span></li>',
    'nextActiveHtml': '<li class="text"><a href="{{itemUrl}}" title="' + bcSfFilterConfig.label.toolbar_next + '"><span>' + bcSfFilterConfig.label.toolbar_next + '</span><i class="fa fa-angle-right" aria-hidden="true"></i></a></li>',
    'nextDisabledHtml': '<li class="disabled"><i class="fa fa-angle-right" aria-hidden="true"></i><span>' + bcSfFilterConfig.label.toolbar_next + '</span></li>',
    'pageItemHtml': '<li><a href="{{itemUrl}}">{{itemTitle}}</a></li>',
    'pageItemSelectedHtml': '<li class="active"><span>{{itemTitle}}</span></li>',
    'pageItemRemainHtml': '<li><span>{{itemTitle}}</span></li>',
    'paginateHtml': '{{previous}}{{pageItems}}{{next}}',
    // Sorting Template
    'sortingHtml': '<span class="bc-sf-filter-sorting-label">' + bcSfFilterConfig.label.sorting + '</span><label><span><span class="bc-sf-filter-top-sorting-label">' + bcSfFilterConfig.label.sorting + '</span></span></label><ul class="bc-sf-filter-filter-dropdown">{{sortingItems}}</ul>',
    
    
};

BCSfFilter.prototype.buildProductGridItem = function(data, index, totalProduct) {
  /*** Prepare data ***/
  var images = data.images_info;
  // Displaying price base on the policy of Shopify, have to multiple by 100
  var soldOut = !data.available; // Check a product is out of stock
  var onSale = data.compare_at_price_max > data.price_max; // Check a product is on sale
  var priceVaries = data.price_min != data.price_max; // Check a product has many prices
  // Get First Variant (selected_or_first_available_variant)
  var firstVariant = data['variants'][0];
  if (getParam('variant') !== null && getParam('variant') != '') {
    var paramVariant = data.variants.filter(function(e) { return e.id == getParam('variant'); });
    if (typeof paramVariant[0] !== 'undefined') firstVariant = paramVariant[0];
  } else {
    for (var i = 0; i < data['variants'].length; i++) {
      if (data['variants'][i].available) {
        firstVariant = data['variants'][i];
        break;
      }
    }
  }
  /*** End Prepare data ***/

  // Get Template
  var itemHtml = bcSfFilterTemplate.productGridItemHtml;

  // Add class
  itemHtml = bcSfFilterConfig.custom.product_image_border ? itemHtml.replace(/{{itemGridBorderClass}}/g, bcSfFilterTemplate.gridBorderClass) : itemHtml.replace(/{{itemGridBorderClass}}/g, '');
  itemHtml = bcSfFilterConfig.custom.product_image_crop ? itemHtml.replace(/{{itemCropImageClass}}/g, 'crop_image') : itemHtml.replace(/{{itemCropImageClass}}/g, 'no_crop_image');
  itemHtml = soldOut ? itemHtml.replace(/{{itemSoldOutClass}}/g, bcSfFilterTemplate.soldOutClass) : itemHtml.replace(/{{itemSoldOutClass}}/g, '');
  itemHtml = onSale ? itemHtml.replace(/{{itemSaleClass}}/g, bcSfFilterTemplate.onSaleClass) : itemHtml.replace(/{{itemSaleClass}}/g, '');
  itemHtml = itemHtml.replace(/{{delayTime}}/g, bcSfFilterConfig.custom.time_lazy_load * index);

  // Add Thumbnail
  //     var itemThumbUrl = images.length > 0 ? this.optimizeImage(images[0]['src'], '1024x1024') : bcSfFilterConfig.general.no_image_url;
  //     var itemFlipImageUrl = images.length > 1 ? this.optimizeImage(images[1]['src'], '1024x1024') : itemThumbUrl;
  
  // Add Thumbnail
  var itemThumbUrl = images.length > 0 ? images[0]['src'] : bcSfFilterConfig.general.no_image_url;
  var itemFlipImageUrl = images.length > 1 ? this.optimizeImage(images[1]['src'], '1024x1024') : itemThumbUrl;
  if (this.queryParams.hasOwnProperty('pf_opt_color')) {
    //var selectedColor = this.queryParams.pf_opt_color[0].toLowerCase();
    var selectedColors = this.queryParams.pf_opt_color;
    for (var k = 0; k < selectedColors.length; k++) {
      var selectedColor = selectedColors[k].toLowerCase();
      for (var i = 0; i < data.variants.length; i++) {
        var variant = data['variants'][i];
        if (variant.hasOwnProperty('merged_options') && variant['merged_options'].length > 0) {
          for (var j = 0; j < variant['merged_options'].length; j++) {
            var mergeValue = variant['merged_options'][j].toLowerCase();
            if (mergeValue.indexOf(selectedColor) > -1 && variant['image']) {
              var itemThumbUrl = variant['image'];
              break;
            }
          }
        }
      }
    }
  }
  itemHtml = itemHtml.replace(/{{itemThumbUrl}}/g, itemThumbUrl);

  var itemFlipImageLabel = images.length > 1 ? 'image-swap ' : '';
  itemHtml = itemHtml.replace(/{{itemFlipImageLabel}}/g, itemFlipImageLabel);

  itemHtml = itemHtml.replace(/{{itemThumbUrl}}/g, itemThumbUrl);
  itemHtml = itemHtml.replace(/{{itemFlipImageUrl}}/g, itemFlipImageUrl);

  // Add Label
  var itemLabelsHtml = '';
  if (onSale || soldOut) {
    itemLabelsHtml += '<div class="product-label">';
    if (onSale) {
      itemLabelsHtml += '<strong class="label sale-label">' + bcSfFilterConfig.label.sale + '</strong>';
    }
    if (soldOut) {
      itemLabelsHtml += '<strong class="label sold-out-label">' + bcSfFilterConfig.label.sold_out + '</strong>';
    }
    itemLabelsHtml += '</div>';
  }
  itemHtml = itemHtml.replace(/{{itemLabels}}/g, itemLabelsHtml);

  // Add Price
  var itemPriceHtml = '';
  if (onSale) {
    itemPriceHtml += '<p class="sale">';
    itemPriceHtml += '<span class="old-price"> ' + this.formatMoney(data.compare_at_price_max) + '</span>';
    itemPriceHtml += '<span class="special-price">';
    if (priceVaries) {
      itemPriceHtml += '<em>' + bcSfFilterConfig.label.from_price + ' </em>';
    }
    itemPriceHtml += this.formatMoney(data.price_max);
    itemPriceHtml += '</span>';
    itemPriceHtml += '</span></p>';
  } else {
    itemPriceHtml += '<p class="regular-product"><span>';
    if (priceVaries) {
      itemPriceHtml += '<em>' + bcSfFilterConfig.label.from_price + ' </em>'
    }
    itemPriceHtml += this.formatMoney(data.price_max, this.moneyFormat);
    itemPriceHtml += '</span></p>';
  }
  itemHtml = itemHtml.replace(/{{itemPrice}}/g, itemPriceHtml);

  // Add Vendor
  var itemVendorHtml = '';
  if (bcSfFilterConfig.custom.show_vendor) {
    itemVendorHtml = '<div class="product-vendor">' + data.vendor + '</div>';
  }
  itemHtml = itemHtml.replace(/{{itemVendor}}/g, itemVendorHtml);

  // Add to cart
  var itemAddToCartHtml = '';
  if (bcSfFilterConfig.custom.display_button) {
    var itemAddToCartHtml = '<div class="action"><form action="/cart/add" method="post" class="variants" id="product-actions-{{itemId}}" enctype="multipart/form-data" style="padding:0px;">';
    if (soldOut) {
      itemAddToCartHtml += '<input class="btn add-to-cart-btn" type="submit" value="' + bcSfFilterConfig.label.unavailable + '" disabled="disabled"/>';
    } else {
      if (data.variants.length > 1) {
        itemAddToCartHtml += '<input class="btn" type="button" onclick="window.location.href=\'{{itemUrl}}\'" value="' + bcSfFilterConfig.label.select_options + '" />';
      } else {
        itemAddToCartHtml += '<input type="hidden" name="id" value="' + firstVariant.id + '" />';
        itemAddToCartHtml += '<button data-btn-addtocart="" class="btn add-to-cart-btn" type="submit" data-form-id="#product-actions-{{itemId}}" data-translate="products.product.add_to_cart">' + bcSfFilterConfig.label.add_to_cart + '</button>';
      }
    }
    itemAddToCartHtml += '</form></div>';
  }
  itemHtml = itemHtml.replace(/{{itemAddToCart}}/g, itemAddToCartHtml);

  //collection related
  var relatedCollection = window.location.pathname + '?view=related';
  itemHtml = itemHtml.replace(/{{itemCollectionRelated}}/g, relatedCollection);


  //{{itemSwatch}}
  // Add item swatch
  itemHtml = itemHtml.replace(/{{itemSizeSwatches}}/g, buildSizeSwatches(data));

  // Add Quick view
  var itemQuickViewHtml = '';
  if (bcSfFilterConfig.custom.enable_quick_view) {
    itemQuickViewHtml = bcSfFilterTemplate.quickViewHtml;
  }
  itemHtml = itemHtml.replace(/{{itemQuickView}}/g, itemQuickViewHtml);

  // Add Review
  var itemReviewHtml = bcSfFilterConfig.custom.display_product_reviews ? bcSfFilterTemplate.reviewHtml : '';
  itemHtml = itemHtml.replace(/{{itemReview}}/g, itemReviewHtml);

  // Add Color Swatches
  itemHtml = itemHtml.replace(/{{itemColorSwatches}}/g, buildColorSwatches(data));

  // Add Wishlist
  itemHtml = itemHtml.replace(/{{itemWishlist}}/g, buildWishlist(data));

  // Image Swap
  var itemImageTwoHtml = '';  
  var itemImageClassHtml = '';
  if (images.length > 1) {
    itemImageClassHtml = 'images-one lazyload';
    itemImageTwoHtml = '<span class="images-two"><img src="' + itemFlipImageUrl + '" alt="{{itemTitle}}" /></span>';
  }
  itemHtml = itemHtml.replace(/{{itemImageClass}}/g, itemImageClassHtml);
  itemHtml = itemHtml.replace(/{{itemImageTwo}}/g, itemImageTwoHtml);

  // Add Description
  var itemDescription = '';
  if (data.body_html != '') {
    itemDescription = jQ('<p>' + data.body_html + '</p>').text();
    var tempArr = itemDescription.split('[/countdown]');
    itemDescription = tempArr.pop();
    itemDescription = this.truncateByWord(itemDescription, 50);
  }
  itemHtml = itemHtml.replace(/{{itemDescription}}/g, itemDescription);

  // Add main attribute
  itemHtml = itemHtml.replace(/{{itemId}}/g, data.id);
  itemHtml = itemHtml.replace(/{{itemHandle}}/g, data.handle);
  itemHtml = itemHtml.replace(/{{itemTitle}}/g, data.title);
  itemHtml = itemHtml.replace(/{{itemUrl}}/g, this.buildProductItemUrl(data));

  return itemHtml;
}

BCSfFilter.prototype.buildProductListItem = function(data, index, totalProduct) {
  /*** Prepare data ***/
  var images = data.images_info;
  // Displaying price base on the policy of Shopify, have to multiple by 100
  var soldOut = !data.available; // Check a product is out of stock
  var onSale = data.compare_at_price_max > data.price_max; // Check a product is on sale
  var priceVaries = data.price_min != data.price_max; // Check a product has many prices
  // Get First Variant (selected_or_first_available_variant)
  var firstVariant = data['variants'][0];
  if (getParam('variant') !== null && getParam('variant') != '') {
    var paramVariant = data.variants.filter(function(e) { return e.id == getParam('variant'); });
    if (typeof paramVariant[0] !== 'undefined') firstVariant = paramVariant[0];
  } else {
    for (var i = 0; i < data['variants'].length; i++) {
      if (data['variants'][i].available) {
        firstVariant = data['variants'][i];
        break;
      }
    }
  }
  /*** End Prepare data ***/

  // Get Template
  var itemHtml = bcSfFilterTemplate.productListItemHtml;

  // Add class
  itemHtml = soldOut ? itemHtml.replace(/{{itemSoldOutClass}}/g, bcSfFilterTemplate.soldOutClass) : itemHtml.replace(/{{itemSoldOutClass}}/g, '');
  itemHtml = onSale ? itemHtml.replace(/{{itemSaleClass}}/g, bcSfFilterTemplate.onSaleClass) : itemHtml.replace(/{{itemSaleClass}}/g, '');
  itemHtml = itemHtml.replace(/{{delayTime}}/g, bcSfFilterConfig.custom.time_lazy_load * index);

  // Add Thumbnail
  var itemThumbUrl = images.length > 0 ? this.optimizeImage(images[0]['src']) : bcSfFilterConfig.general.no_image_url;
  itemHtml = itemHtml.replace(/{{itemThumbUrl}}/g, itemThumbUrl);

  // Add Label
  var itemLabelsHtml = '';
  if (onSale || soldOut) {
    itemLabelsHtml += '<div class="product-label">';
    if (onSale) {
      itemLabelsHtml += '<strong class="label">' + bcSfFilterConfig.label.sale + '</strong>';
    }
    if (soldOut) {
      itemLabelsHtml += '<strong class="sold-out-label">' + bcSfFilterConfig.label.sold_out + '</strong>';
    }
    itemLabelsHtml += '</div>';
  }
  itemHtml = itemHtml.replace(/{{itemLabels}}/g, itemLabelsHtml);

  // Add Price
  var itemPriceHtml = '';
  if (onSale) {
    itemPriceHtml += '<p class="sale">';
    itemPriceHtml += '<span class="old-price money"> ' + this.formatMoney(data.compare_at_price_min) + '</span>';
    if (priceVaries) {
      itemPriceHtml += '<span class="special-price"><em>' + bcSfFilterConfig.label.from_price + ' </em>';
    } else {
      itemPriceHtml += '<span class="special-price">';
    }
    itemPriceHtml += this.formatMoney(data.price_max, this.moneyFormat);
    itemPriceHtml += '</span></p>';
  } else {
    itemPriceHtml += '<p class="regular-product">';
    if (priceVaries) {
      itemPriceHtml += '<span class="money"><em>' + bcSfFilterConfig.label.from_price + ' </em>' + this.formatMoney(data.price_max) + '</span>';
    } else {
      itemPriceHtml += '<span class="money">' + this.formatMoney(data.price_max) + '</span>';
    }
    itemPriceHtml += '</p>';
  }
  itemHtml = itemHtml.replace(/{{itemPrice}}/g, itemPriceHtml);

  // Add Vendor
  var itemVendorHtml = '';
  if (bcSfFilterConfig.custom.show_vendor) {
    itemVendorHtml = '<div class="product-vendor">' + data.vendor + '</div>';
  }
  itemHtml = itemHtml.replace(/{{itemVendor}}/g, itemVendorHtml);

  // Add to cart
  var itemAddToCartHtml = '<form action="/cart/add" method="post" class="variants" id="product-actions-{{itemId}}" enctype="multipart/form-data" style="padding:0px;">';
  if (soldOut) {
    itemAddToCartHtml += '<input class="btn add-to-cart-btn" type="submit" value="' + bcSfFilterConfig.label.unavailable + '" disabled="disabled"/>';
  } else {
    if (data.variants.length > 1) {
      itemAddToCartHtml += '<input class="btn" type="button" onclick="window.location.href=\'{{itemUrl}}\'" value="' + bcSfFilterConfig.label.select_options + '" />';
    } else {
      itemAddToCartHtml += '<input type="hidden" name="id" value="' + firstVariant.id + '" />';
      itemAddToCartHtml += '<input class="btn add-to-cart-btn" type="submit" data-form-id="#product-actions-{{itemId}}" value="' + bcSfFilterConfig.label.add_to_cart + '" />';
    }
  }
  itemAddToCartHtml += '</form>';
  itemHtml = itemHtml.replace(/{{itemAddToCart}}/g, itemAddToCartHtml);

  // Add Quick view
  var itemQuickViewHtml = '';
  if (bcSfFilterConfig.custom.enable_quick_view) {
    itemQuickViewHtml = bcSfFilterTemplate.quickViewHtml;
  }
  itemHtml = itemHtml.replace(/{{itemQuickView}}/g, itemQuickViewHtml);

  // Add Review
  var itemReviewHtml = bcSfFilterConfig.custom.display_product_reviews ? bcSfFilterTemplate.reviewHtml : '';
  itemHtml = itemHtml.replace(/{{itemReview}}/g, itemReviewHtml);

  // Add Color Swatches
  itemHtml = itemHtml.replace(/{{itemColorSwatches}}/g, buildColorSwatches(data));

  // Add Wishlist
  itemHtml = itemHtml.replace(/{{itemWishlist}}/g, buildWishlist(data));

  // Add Description
  var itemDescription = '';
  if (data.body_html.indexOf('[countdown]') !== -1) {
    itemDescription = jQ('<p>' + data.body_html + '</p>').text();
    var tempArr = itemDescription.split('[/countdown]');
    itemDescription = tempArr.pop();
    itemDescription = this.truncateByWord(itemDescription, 50);
  }
  itemHtml = itemHtml.replace(/{{itemDescription}}/g, itemDescription);

  // Add main attribute
  itemHtml = itemHtml.replace(/{{itemId}}/g, data.id);
  itemHtml = itemHtml.replace(/{{itemHandle}}/g, data.handle);
  itemHtml = itemHtml.replace(/{{itemTitle}}/g, data.title);
  itemHtml = itemHtml.replace(/{{itemUrl}}/g, this.buildProductItemUrl(data));

  return itemHtml;
}

// Build Wishlist
function buildWishlist(data) {
  // Add Wishlist
  var wishlistHtml = '';
  if (bcSfFilterConfig.custom.enable_wishlist) {
    var value = (data.id).toString();
    var productId = (data.id).toString();
    for (var k in bcSfFilterConfig.customer.tags) {

      var tagID = bcSfFilterConfig['customer']['tags'][k];
      if (tagID.indexOf(productId) > -1) {
        value = 'x' + tagID;
      }
      if (value.length == 0) value = productId;
    }
    if (value.length > 0) {
      var check = ((value.length - productId.length) / 2).toString();
      check = check.split('.');
      var display = check.length > 1 && check[1].indexOf('5') > -1 ? false : true;
    }

    wishlistHtml += '<a class="wishlist" data-icon-wishlist href="#" data-product-handle="' + data.handle + '"title="' + bcSfFilterConfig.label.wishlist_note + '" data-id="' + data.id + '">' +
      '<i class="fa fa-heart" aria-hidden="true"></i>' +
      '<span class="wishlist-text text-hover">' + bcSfFilterConfig.label.add_to_wishlist + '</span>' +
      '</a>';

  }
  return wishlistHtml;
}

// Build Size Swatches
function buildSizeSwatches(data) {
  var sizeSwatchesHtml = '';
  if (bcSfFilterConfig.custom.enable_size_swatch && data.available && data.variants.length > 0) {
    sizeSwatchesHtml += '<ul class="sizes-list">';

    for (var index in data.options) {
      var option = data['options'][index].toLowerCase();
      if (option == 'size') {
        var sizelist = '';
        var size = '';
        var totalVariants = 0;
        for (var k in data.variants) {
          var variant = data['variants'][k];
          size = variant['options'][index];
          if (sizelist.indexOf(size) == -1) {
            if (totalVariants < 4) {
              sizeSwatchesHtml += '<li class="size-item">';
              sizeSwatchesHtml += '<a title="' + size + '" href="' + data.url + '?variant=' + variant.id + '">' + size + '</a>';
              sizeSwatchesHtml += '</li>';
            }
            var templist = sizelist + size + ' ';
            sizelist = templist;

            totalVariants++;
          }
        }

        if (totalVariants >= 4) {
          sizeSwatchesHtml += '<li class="item-size-more">';
          sizeSwatchesHtml += '<a href="{{itemUrl}}" title="More Size">+' + (totalVariants - 3) + '</a>';
          sizeSwatchesHtml += '</li>';
          totalVariants = 0;
        }
      }
    }

    sizeSwatchesHtml += '</ul>';
  }

  return sizeSwatchesHtml;
}

// Build Color Swatches
function buildColorSwatches(data) {
  var colorSwatchesHtml = '';
  if (bcSfFilterConfig.custom.display_item_swatch) {
    colorSwatchesHtml += '<ul class="item-swatch">';
    for (var index in data.options) {
      var option = data['options'][index].toLowerCase();
      if (option == 'color') {
        var colorlist = '';
        var color = '';
        var totalVariants = 0;
        for (var k in data.variants) {
          var variant = data['variants'][k];
          color = variant['options'][index];
          if (colorlist.indexOf(color) == -1) {
            if (totalVariants < 4) {
              var text = bcsffilter.slugify(color);
              var border = text == 'white' ? 'border: 1px solid #cbcbcb;' : '';
              var backgroundImage = bcsffilter.optimizeImage(variant.image, '24x');
              var dataImg = '';
              var dataColor = '#fff';
              if (variant.image !== null) {
                dataImg = "data-img='" + bcsffilter.optimizeImage(variant.image) + "'";
              } else {
                var _file = variant.option_color.toLowerCase().replace(/ /g, '-');
                var dataColors = variant.option_color.toLowerCase().split(' ');
                var i = dataColors.length - 1;
                if (dataColors[i] !== '' && dataColors[i] !== 'colors') {
                  dataColor = dataColors[i];
                }

                backgroundImage = bcSfFilterConfig.general.asset_url.replace('bc-sf-filter.js', _file + '.png')
              }

              colorSwatchesHtml += '<li>';
              colorSwatchesHtml += '<div class="tooltip">' + color + '</div>';
              colorSwatchesHtml += '<label style="' + border + 'background-image: url(' + backgroundImage + '); background-color: ' + dataColor + ';"' + dataImg + '></label>';

              // colorSwatchesHtml += '<label style="' + border + 'background-image: url(' + bcsffilter.optimizeImage(variant.image, '24x') + ');"' + if (variant.image !== null){ + 'data-img="' + bcsffilter.optimizeImage(variant.image) + '"' + } '></label>';
              colorSwatchesHtml += '</li>';

            }
            var templist = colorlist + color + ' ';
            colorlist = templist;

            totalVariants++;

          }

        }

        if (totalVariants > 4) {
          colorSwatchesHtml += '<li class="item-swatch-more">';
          colorSwatchesHtml += '<a href="{{itemUrl}}" title="More Color">+' + (totalVariants - 4) + '</a>';
          colorSwatchesHtml += '</li>';
          totalVariants = 0;
        }
      }
    }
    colorSwatchesHtml += '</ul>';
  }
  return colorSwatchesHtml;
}

// Build Pagination
BCSfFilter.prototype.buildPagination = function(totalProduct) {
  // Get page info
  var currentPage = parseInt(this.queryParams.page);
  var totalPage = Math.ceil(totalProduct / this.queryParams.limit);

  // If it has only one page, clear Pagination
  if (totalPage == 1) {
    jQ(this.selector.pagination).html('');
    return false;
  }

  if (this.getSettingValue('general.paginationType') == 'default') {
    var paginationHtml = bcSfFilterTemplate.paginateHtml;

    // Build Previous
    var previousHtml = (currentPage > 1) ? bcSfFilterTemplate.previousActiveHtml : bcSfFilterTemplate.previousDisabledHtml;
    previousHtml = previousHtml.replace(/{{itemUrl}}/g, this.buildToolbarLink('page', currentPage, currentPage - 1));
    paginationHtml = paginationHtml.replace(/{{previous}}/g, previousHtml);

    // Build Next
    var nextHtml = (currentPage < totalPage) ? bcSfFilterTemplate.nextActiveHtml : bcSfFilterTemplate.nextDisabledHtml;
    nextHtml = nextHtml.replace(/{{itemUrl}}/g, this.buildToolbarLink('page', currentPage, currentPage + 1));
    paginationHtml = paginationHtml.replace(/{{next}}/g, nextHtml);

    // Create page items array
    var beforeCurrentPageArr = [];
    for (var iBefore = currentPage - 1; iBefore > currentPage - 3 && iBefore > 0; iBefore--) {
      beforeCurrentPageArr.unshift(iBefore);
    }
    if (currentPage - 4 > 0) {
      beforeCurrentPageArr.unshift('...');
    }
    if (currentPage - 4 >= 0) {
      beforeCurrentPageArr.unshift(1);
    }
    beforeCurrentPageArr.push(currentPage);

    var afterCurrentPageArr = [];
    for (var iAfter = currentPage + 1; iAfter < currentPage + 3 && iAfter <= totalPage; iAfter++) {
      afterCurrentPageArr.push(iAfter);
    }
    if (currentPage + 3 < totalPage) {
      afterCurrentPageArr.push('...');
    }
    if (currentPage + 3 <= totalPage) {
      afterCurrentPageArr.push(totalPage);
    }

    // Build page items
    var pageItemsHtml = '';
    var pageArr = beforeCurrentPageArr.concat(afterCurrentPageArr);
    for (var iPage = 0; iPage < pageArr.length; iPage++) {
      if (pageArr[iPage] == '...') {
        pageItemsHtml += bcSfFilterTemplate.pageItemRemainHtml;
      } else {
        pageItemsHtml += (pageArr[iPage] == currentPage) ? bcSfFilterTemplate.pageItemSelectedHtml : bcSfFilterTemplate.pageItemHtml;
      }
      pageItemsHtml = pageItemsHtml.replace(/{{itemTitle}}/g, pageArr[iPage]);
      pageItemsHtml = pageItemsHtml.replace(/{{itemUrl}}/g, this.buildToolbarLink('page', currentPage, pageArr[iPage]));
    }
    paginationHtml = paginationHtml.replace(/{{pageItems}}/g, pageItemsHtml);

    paginationHtml = jQ.parseHTML(paginationHtml);
    jQ(this.selector.pagination).html(paginationHtml);
  }
};

// Build Sorting
BCSfFilter.prototype.buildFilterSorting = function() {
  if (bcSfFilterTemplate.hasOwnProperty('sortingHtml')) {
    var self = this;
    var sortingSelector = jQ(self.getSelector('topSorting'));
    sortingSelector.empty();
    var sortingArr = this.getSortingList();
    if (sortingArr) {
      // Build content
      var sortingItemsHtml = '';
      for (var k in sortingArr) {
        var activeClass = self.queryParams.sort == k ? 'active' : '';
        sortingItemsHtml += '<li><a data-bc-sort-value="' + sortingArr[k] + '" href="#" data-bc-sort="' + k + '" class="' + activeClass + '">' + sortingArr[k] + '</a></li>';
      }
      var html = bcSfFilterTemplate.sortingHtml.replace(/{{sortingItems}}/g, sortingItemsHtml);
      html = jQ.parseHTML(html);
      sortingSelector.html(html);
      sortingSelector.removeClass('bc-sf-filter-sort-active');
      sortingSelector.find('.bc-sf-filter-top-sorting-label').text(sortingSelector.find('a[data-bc-sort="' + self.queryParams.sort + '"]').data('bc-sort-value'));
    }
  }
};

// Build Sorting event
BCSfFilter.prototype.buildSortingEvent = function() {
  var _this = this;
  var sortingSelector = jQ(_this.getSelector('topSorting'));
  sortingSelector.find('a').click(function(e) {
    e.preventDefault();
    onInteractWithToolbar(e, 'sort', _this.queryParams.sort, jQ(this).data('bc-sort'));
  });

  sortingSelector.find('label').click(function(e) {
    e.preventDefault();
    if (!sortingSelector.find('.bc-sf-filter-filter-dropdown').is(':animated')) {
      sortingSelector.find('.bc-sf-filter-filter-dropdown').toggle();
      sortingSelector.toggleClass('bc-sf-filter-sort-active');
    }
  });
};

BCSfFilter.prototype.buildExtrasProductList = function(data) {
  /**
   * Reinit theme function
   * 1. Add `var bcElla;` to assets/ella.min.js
   * 2. In assets/ella.min.js, find XXX.init(), for example: f.init()
   * 3. Go to the end of assets/ella.min.js, replace: `}(jQuery);` by `bcElla = XXX;}(jQuery);`   * 
   */
  if (typeof bcElla != 'undefined') {
    bcElla.initAddToCart();
    bcElla.initGroupedAddToCart();
    bcElla.changeQuantityAddToCart();
    bcElla.initStickyAddToCart();
    bcElla.initQuickView();
    bcElla.initColorSwatchGrid();
  }
};

// Build Additional Elements
BCSfFilter.prototype.buildAdditionalElements = function(data) {
  if(jQ('#bc-sf-filter-total-products').length > 0 && data.products.length > 0){
    var from = this.queryParams.page == 1 ? this.queryParams.page : (this.queryParams.page - 1) * this.queryParams.limit + 1;
    var to = from + data.products.length - 1;
    var totalProductsSelector = jQ('#bc-sf-filter-total-products');
    var totalProduct = bcSfFilterConfig.label.toolbar_showing + ' ' + from + '-' + to + ' ' +  bcSfFilterConfig.label.toolbar_of + ' ' + data.total_product;
    totalProduct = jQ.parseHTML(totalProduct);
    totalProductsSelector.empty().html(totalProduct);  
  }
};

// Build Default layout
BCSfFilter.prototype.buildDefaultElements=function(){var isiOS=/iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.MSStream,isSafari=/Safari/.test(navigator.userAgent),isBackButton=window.performance&&window.performance.navigation&&2==window.performance.navigation.type;if(!(isiOS&&isSafari&&isBackButton)){var self=this,url=window.location.href.split("?")[0],searchQuery=self.isSearchPage()&&self.queryParams.hasOwnProperty("q")?"&q="+self.queryParams.q:"";window.location.replace(url+"?view=bc-original"+searchQuery)}};

function customizeJsonProductData(data) {for (var i = 0; i < data.variants.length; i++) {var variant = data.variants[i];var featureImage = data.images.filter(function(e) {return e.src == variant.image;});if (featureImage.length > 0) {variant.featured_image = {"id": featureImage[0]['id'],"product_id": data.id,"position": featureImage[0]['position'],"created_at": "","updated_at": "","alt": null,"width": featureImage[0]['width'], "height": featureImage[0]['height'], "src": featureImage[0]['src'], "variant_ids": [variant.id]}} else {variant.featured_image = '';};};var self = bcsffilter;var itemJson = {"id": data.id,"title": data.title,"handle": data.handle,"vendor": data.vendor,"variants": data.variants,"url": self.buildProductItemUrl(data),"options_with_values": data.options_with_values,"images": data.images,"images_info": data.images_info,"available": data.available,"price_min": data.price_min,"price_max": data.price_max,"compare_at_price_min": data.compare_at_price_min,"compare_at_price_max": data.compare_at_price_max};return itemJson;};
BCSfFilter.prototype.prepareProductData=function(data){var self=this;var countData=data.length;for(var k=0;k<countData;k++){data[k]["images"]=data[k]["images_info"];if(data[k]["images"].length>0){data[k]["featured_image"]=data[k]["images"][0]}else{data[k]["featured_image"]={src:bcSfFilterConfig.general.no_image_url,width:"",height:"",aspect_ratio:0}}data[k]["url"]="/products/"+data[k].handle;var optionsArr=[];var countOptionsWithValues=data[k]["options_with_values"].length;for(var i=0;i<countOptionsWithValues;i++){optionsArr.push(data[k]["options_with_values"][i]["name"])}data[k]["options"]=optionsArr;var firstVariant=data[k]["variants"][0];var isRoundedPrice=true;if(firstVariant.hasOwnProperty("fulfillment_service")&&firstVariant.fulfillment_service=="gift_card"){isRoundedPrice=false}if(typeof self.convertPriceBasedOnActiveCurrency!=="undefined"){data[k].price_min=self.convertPriceBasedOnActiveCurrency(data[k].price_min,isRoundedPrice);data[k].price_max=self.convertPriceBasedOnActiveCurrency(data[k].price_max,isRoundedPrice);data[k].compare_at_price_min=self.convertPriceBasedOnActiveCurrency(data[k].compare_at_price_min,isRoundedPrice);data[k].compare_at_price_max=self.convertPriceBasedOnActiveCurrency(data[k].compare_at_price_max,isRoundedPrice)}data[k]["price_min"]*=100,data[k]["price_max"]*=100;if(data[k]["compare_at_price_min"]!=null){data[k]["compare_at_price_min"]*=100}if(data[k]["compare_at_price_max"]!=null){data[k]["compare_at_price_max"]*=100}data[k]["price"]=data[k]["price_min"];data[k]["compare_at_price"]=data[k]["compare_at_price_min"];data[k]["price_varies"]=data[k]["price_min"]!=data[k]["price_max"];if(getParam("variant")!==null&&getParam("variant")!=""){var paramVariant=data[k]["variants"].filter(function(e){return e.id==getParam("variant")});if(typeof paramVariant[0]!=="undefined")firstVariant=paramVariant[0]}else{var countVariants=data[k]["variants"].length;for(var i=0;i<countVariants;i++){if(data[k]["variants"][i].available){firstVariant=data[k]["variants"][i];break}}}data[k]["selected_or_first_available_variant"]=firstVariant;var countVariants=data[k]["variants"].length;for(var i=0;i<countVariants;i++){var variantOptionArr=[];var count=1;var variant=data[k]["variants"][i];var variantOptions=variant["merged_options"];if(Array.isArray(variantOptions)){var countVariantOptions=variantOptions.length;for(var j=0;j<countVariantOptions;j++){var temp=variantOptions[j].split(":");data[k]["variants"][i]["option"+(parseInt(j)+1)]=temp[1];data[k]["variants"][i]["option_"+temp[0]]=temp[1];variantOptionArr.push(temp[1])}data[k]["variants"][i]["options"]=variantOptionArr}if(data[k]["variants"][i]["compare_at_price"]!=null){var variantCompareAtPrice=parseFloat(data[k]["variants"][i]["compare_at_price"]);if(typeof self.convertPriceBasedOnActiveCurrency!=="undefined"){variantCompareAtPrice=self.convertPriceBasedOnActiveCurrency(variantCompareAtPrice,isRoundedPrice)}data[k]["variants"][i]["compare_at_price"]=variantCompareAtPrice*100}var variantPrice=parseFloat(data[k]["variants"][i]["price"]);if(typeof self.convertPriceBasedOnActiveCurrency!=="undefined"){variantPrice=self.convertPriceBasedOnActiveCurrency(variantPrice,isRoundedPrice)}data[k]["variants"][i]["price"]=variantPrice*100}data[k]["description"]=data[k]["content"]=data[k]["body_html"];if(data[k].hasOwnProperty("original_tags")&&data[k]["original_tags"].length>0){data[k]["tags"]=data[k]["original_tags"].slice(0)}data[k]["json"]=customizeJsonProductData(data[k])}return data};

/* Begin patch boost-010 run 2 */
BCSfFilter.prototype.initFilter=function(){return this.isBadUrl()?void(window.location.href=window.location.pathname):(this.updateApiParams(!1),void this.getFilterData("init"))},BCSfFilter.prototype.isBadUrl=function(){try{var t=decodeURIComponent(window.location.search).split("&"),e=!1;if(t.length>0)for(var i=0;i<t.length;i++){var n=t[i],a=(n.match(/</g)||[]).length,r=(n.match(/>/g)||[]).length,o=(n.match(/alert\(/g)||[]).length,h=(n.match(/execCommand/g)||[]).length;if(a>0&&r>0||a>1||r>1||o||h){e=!0;break}}return e}catch(l){return!0}};
/* End patch boost-010 run 2 */
