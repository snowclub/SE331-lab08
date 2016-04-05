'use strict';

var productMainController = angular.module('productMainController', ['productServices']);

productMainController.controller('addProductController', ['$scope', '$http', '$location', '$rootScope','productService',
    function ($scope, $http, $location, $rootScope,productService) {
        $scope.product = {};
        $scope.addPerson = true;
        $scope.editPerson = false;
        $scope.addProduct = function (flowFiles) {

            //$http.post("/product", $scope.product).success(function () {
            productService.save($scope.product,function(data){
                //after adding the object, add a new picture
                //get the product id which the image will be added
                var productid=data.id;
                //set location
                flowFiles.opts.target='http://localhost:8080/productImage/add';
                flowFiles.opts.testChunks = false;
                flowFiles.opts.query = {productid:productid};
                flowFiles.upload();
                $scope.$apply(); 

            });
        };


    }]);

productMainController.controller('listProductController', ['$scope', '$http', '$rootScope','productService','$route','totalCalService','queryProductService',
    function ($scope, $http, $rootScope,productService,$route,totalCalService,queryProductService) {
        //$http.get("/product/").success(function (data) {
        var data = productService.query(function(){
           // $scope.totalNetPrice= totalCalService.getTotalNetPrice(data);
            $scope.products = data;
        });


        $scope.$on('$locationChangeStart', function (event) {
            $rootScope.addSuccess = false;
            $rootScope.editSuccess = false;
            $rootScope.deleteSuccess = false;
        });

        $scope.deleteProduct = function (id) {
            var answer = confirm("Do you want to delete the product?");
            if (answer) {
                productService.delete({id:id},function(){
                    $rootScope.deleteSuccess = true;
                    $route.reload();
                })
            }
        }

        $scope.searchProduct = function(name){
           queryProductService.query({name:name},function(data) {
                $scope.products = data;
            });
        }

    }]);

productMainController.controller('editProductController', ['$scope', '$http', '$routeParams', '$location', '$rootScope','productService',
    function ($scope, $http, $routeParams, $location, $rootScope,productService) {
        $scope.addPerson = false;
        $scope.editPerson = true;
        var id = $routeParams.id;
        $http.get("http://localhost:8000/product/" + id).success(function (data) {
            $scope.product = data;
        });

        $scope.editProduct = function () {
            //$http.put("/product", $scope.product).then(function () {
            productService.update({id:$scope.product.id},$scope.product,function(){
                $rootScope.editSuccess = true;
                $location.path("listProduct");
            });
        }
    }]);