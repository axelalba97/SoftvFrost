"use strict";
angular
  .module("softvFrostApp")
  .controller("DiagnosticCtrl", function (
    diagnosticFactory,
    mapaBeamFactory,
    OVTFactory,
    ngNotify,
    globalService,
    terminalFactory
  ) {
    this.$onInit = function () {
      diagnosticFactory.getLoginUid().then(function (data) {
        
        vm.token = data[0].loginuuid;
        $(".diagnostic").collapse();
        $(".diagnosis").collapse();
        $(".table-info").collapse();
      });
    };

    function hughesGetSanCompuesto(obj) {
      var a = obj.toString();
      var i;
      for (i = a.length; i < 9; i++) {
        a = "0" + a;
      }
      return globalService.getType() + a;
    }

    function GetToken() {
      diagnosticFactory.getLoginUid().then(function (data) {
        vm.token = data[0].loginuuid;
      });
    }

    function searchSan() {
      terminalFactory.GetValidaSANUsuario(vm.san).then(function (data) {
        
        if (data.GetValidaSANUsuarioResult === true) {
          var sanData = {
            token: vm.token,
            san: vm.san
          };
          console.log('sanData',sanData);
          diagnosticFactory.getCommand(sanData).then(function (dataCommand) {
            console.log('dataCommand',dataCommand);
            var datos = JSON.parse(dataCommand);

            if (datos.length > 0) {
              vm.diagnosticData = datos[0];
              vm.showSan = true;

              mapaBeamFactory
                .GetTerminalStatus(vm.san)
                .then(function (response) {
                  vm.datosterminal = JSON.parse(response);
                  console.log(vm.datosterminal);
                });
            } else {
              vm.diagnosticData = datos[0];
              vm.showSan = true;
              ngNotify.set("San is not found.", "error");
            }
          });


        } else {
          ngNotify.set("Lo sentimos, no cuentas con acceso a esta información", "warn");
        }
      });


    }

    function recommendedAction() {
      var sanData = {
        token: vm.token,
        san: vm.san,
        command: "ACTIONS",
        param1: vm.diagnosticData.RECOMM_IDX,
        param2: vm.diagnosticData.Diagnosis_Idx
      };
      diagnosticFactory.setCommand(sanData).then(function (data) {
        var datos = JSON.parse(data);
        vm.diagnosticData = datos[0];
        ngNotify.set("Recommended actions applied correctly.", "success");
      });
    }

    function acctionButtons(param) {
      var sanData = {
        token: vm.token,
        san: vm.san,
        command: "SDT_COMMAND",
        param1: param,
        param2: ""
      };
      diagnosticFactory.setCommand(sanData).then(function (data) {
        var datos = JSON.parse(data);
        switch (param) {
          case "Current_Stats":
            vm.diagnosticData = datos[0];
            ngNotify.set("Data was updated.", "success");
            break;
          case "Force_range":
            ngNotify.set(datos.Message, "info");
            break;
          case "Clear_Term_Stats":
            ngNotify.set(datos.Message, "info");
            break;
          case "Reregister":
            ngNotify.set(datos.Message, "info");
            break;
          case "Reload_tables":
            ngNotify.set(datos.Message, "info");
            break;
          case "Force_fallback":
            ngNotify.set(datos.Message, "info");
            break;
          case "Reboot":
            ngNotify.set(datos.Message, "info");
            break;
          case "Reassociate":
            ngNotify.set(datos.Message, "info");
            break;
          case "Clear_PEP_Stats":
            ngNotify.set(datos.Message, "info");
            break;
        }
      });
    }

    var vm = this;

    vm.searchSan = searchSan;
    vm.san = "";
    vm.recommendedAction = recommendedAction;
    vm.acctionButtons = acctionButtons;
  });
