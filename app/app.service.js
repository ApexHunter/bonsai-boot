api.$inject = ['Restangular', '$rootScope', '$timeout', '$http', '$state', '$cacheFactory'];
function api(Restangular, $rootScope, $timeout, $http, $state, $cacheFactory) {
    var defaultFilter = {
        IsPagination: false,
        PageIndex: 1,
        PageSize: 10
    }

    //Manipulando o cache
    var cache = $cacheFactory('http');
    Restangular.setDefaultHttpFields({
        cache: cache,
        headers: {
            common: { 'Cache-Control': 'no-cache' },
            get: { 'If-Modified-Since': '0' }
        }
    });

    Restangular.setResponseInterceptor(function (response, operation) {
        cache.removeAll();
        return response;
    })

    var init = function (o, isApi) {
        // Adicionando timeout nas requisições;
        var base = Restangular.all(o).withHttpConfig({
            timeout: 90000
        });
        var self = this;
        var timeoutTable = null;
        var baseUrl = configApi.Url;
        var objSelecionado = o;
        
        Restangular.setBaseUrl(baseUrl);
        

        //tratamento de erros
        Restangular.setErrorInterceptor(function (response, deferred, responseHandler) {
            //erro timeout
            if (response.status === -1 && response.config.url.indexOf(urlApi + '?') === -1) {
                swal('Tempo de Resposta Excedido', 'O servidor teve problemas em retornar sua solicitação. Por favor tente novamente mais tarde', 'error')
                $.post(urlApi + 'api/log/SalvarLog', {
                    "CodLogErro": 0,
                    "Erro": "timeout " + $state.current.url,
                    "Url": response.config.url,
                    "Login": $rootScope.usuarioAcesso.nrFunc,
                    "Excecao": "",
                    "DtEvento": moment().format('YYYY-MM-DD HH:mm:ss.SSS')
                });
                return false; // error handled
            }

            return true; // error not handled
        });
        // if (currentUser != undefined && currentUser != '') {
        //     Restangular.setDefaultHeaders({ token: currentUser.Token });
        // }

        this.filter = angular.copy(defaultFilter);
        this.get = function () {
            self.filter.rdm = Math.random();
            if (self.attr != undefined && self.attr != null) { self.filter.AttributeBehavior = self.attr }
            var ret = {};
            if (self.optz != undefined) { self.filter.QueryOptimizerBehavior = self.optz }

            if (self.filter.key != undefined) { // Consulta de DATA
                var key = self.filter.key;
                self.filter.key = null;
                ret = base.customGET(key, self.filter);
            } else { // Consulta de DataList
                if (self.datatable != undefined && self.datatable != null) { //Se for DataTable

                    if (self.searchByColunm != undefined && self.searchByColunm != null) {
                        var columsSearch = [];
                        var searchByColunm = self.searchByColunm || [];
                        var nomeDataTable = self.tableId;
                        if ($('#' + nomeDataTable + ' thead td input').length == 0) {
                            var retSearch = '<tr>';
                            var x = 0;
                            $('#' + nomeDataTable + ' thead th').each(function () {
                                var title = $(this).text();
                                var hasCol = false;
                                for (var y in searchByColunm) {
                                    if (searchByColunm[y] == x) {
                                        retSearch += '<td><input type="text" dt-column="' + x + '" style="width:100%" /></td>';
                                        hasCol = true;
                                    }
                                }
                                if (!hasCol) {
                                    retSearch += '<td></td>';
                                }
                                x++;
                            });
                            retSearch += '</tr>';
                            $('#' + nomeDataTable + ' thead').append(retSearch);

                            var table = $('#' + nomeDataTable).DataTable();

                            $('#' + nomeDataTable + ' thead td input').on('keyup change', function () {
                                if (timeoutTable != null) {
                                    $timeout.cancel(timeoutTable);
                                }

                                timeoutTable = $timeout(function () {
                                    table.columns($(this).attr('dt-column')).search($(this).val()).draw();
                                }, 300);
                            });
                            $('#' + nomeDataTable).parent().parent().prev().find('#dt_filter').hide();
                            $('#' + nomeDataTable).parent().css('overflow-x', 'auto');


                        }
                        for (var x in $('#' + nomeDataTable).DataTable().context[0].aoColumns) {
                            columsSearch.push({
                                search: '',
                                colunmName: $('#' + nomeDataTable).DataTable().context[0].aoColumns[x].name || $('#' + nomeDataTable).DataTable().context[0].aoColumns[x].data
                            });
                        }

                        $('#' + nomeDataTable + ' thead td input').each(function () {
                            var idCol = $.trim($(this).attr('dt-column'));
                            if (idCol != '') {
                                columsSearch[idCol].search = $(this).val();
                            }
                        });
                    }

                    var customString = '';
                    if (self.customList == true) {
                        customString = 'GetDataListCustom';
                    } else {
                        self.filter.IsPagination = true;
                        self.filter.PageSize = self.datatable.length;
                        self.filter.PageIndex = (self.datatable.start <= 0) ? 1 : (self.datatable.start / self.datatable.length) + 1;
                        self.filter.IsOrderByDynamic = true;
                        self.filter.OrderFields = self.datatable.columns[self.datatable.order[0].column].data;
                        for (var x in columsSearch) {
                            if ($.trim(columsSearch[x].search) != '') {
                                self.filter[columsSearch[x].colunmName] = columsSearch[x].search;
                            }
                        }
                    }

                    self.filter.orderByType = ((self.datatable.order[0].dir == 'desc') ? 'OrderByDescending' : 'OrderBy');

                    ret = base.customGET(customString, self.filter).then(function (d) {
                        self.callback({
                            recordsTotal: (d.Summary == undefined) ? 0 : d.Summary.Total,
                            recordsFiltered: (d.Summary == undefined) ? 0 : d.Summary.Total,
                            data: (d.Summary == undefined) ? d : d.DataList
                        });
                    });
                    self.datatable = null;
                } else {
                    if (self.customList == true) {
                        ret = base.customGET('GetDataListCustom', self.filter);
                        self.customList = false;
                    } else if (self.byModel == true) {
                        ret = base.customGET('GetByModel', self.filter);
                        self.byModel = false;
                    } else if (self.customGET == true) {
                        ret = base.customGET('', self.filter);
                        self.customGET = false;
                    } else {
                        ret = base.getList(self.filter);
                    }
                }
            }

            self.filter = angular.copy(defaultFilter);
            self.attr = null;
            self.optz = null;
            self.customList = false;
            return ret;
        }

        this.post = function (item, isJquery) {
            if (self.attr != undefined && self.attr != null) { item.AttributeBehavior = self.attr }
            var ret = null;
            if (isJquery) {
                ret = jQuery.post(baseUrl + objSelecionado, item);
            } else {
                if (Object.prototype.toString.call(item) === '[object Array]') {
                    ret = base.all('postmany').post(item);
                } else {
                    ret = base.post(item);
                }
            }

            self.filter = angular.copy(defaultFilter);
            return ret;
        }

        this.put = function (item) {
            if (self.attr != undefined && self.attr != null) { item.AttributeBehavior = self.attr }
            self.filter = angular.copy(defaultFilter);
            return base.customPUT(item);
        }

        this.delete = function () {
            var ret = {};
            if (self.filter.key != undefined) {
                ret = base.remove(self.filter.key);
            } else {
                ret = base.remove(self.filter);
            }

            self.filter = angular.copy(defaultFilter);
            return ret;
        }
    }

    this.obj = function (o, isApi) {
        return new init(o, isApi);
    }
}