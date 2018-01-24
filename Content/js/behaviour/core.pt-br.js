﻿var resources = resources || {
    
    dictionary: {
        // Texts
        'SeeOnMap': 'Ver no mapa',
        'Success': 'Sucesso',
        'RegistryEditedWithSuccess': 'Registro editado com sucesso',
        'RegisteredSuccessfully': 'Registro efetuado com sucesso',
        'ManyRegisteredSuccessfully': ' registros efetuados com sucesso',
        'Search...': 'Pesquisar...',
        'BuildName': 'Prédio',
        'true': 'Sim',
        'false': 'Não',
        // Datetimepicker
        'DatetimePicker.SmallDateFormat': 'dd/mm/yyyy',
        'DatetimePicker.Language': 'pt-BR',
        // Daterangepicker
        'Tomorrow' : 'Amanhã',
        'Today' : 'Hoje',
        'Yesterday' : 'Ontem',
        'Last 7 Days' : 'Ultimos 7 dias',
        'Last 30 Days' : 'Ultimos 30 dias',
        'This Month' : 'Mês atual',
        'Last Month': 'Mês passado',
        'SmallDateFormat': 'DD/MM/YYYY',
        ' to ': ' até ',
        'Submit': 'Aplicar',
        'Clear' : 'Limpar',
        'From' : 'De',
        'To' : 'Até',
        'Custom' : 'Outro',
        // Monetary and numeric
        '$': 'R$',
        'DecimalSeparator': ',',
        // Location Types
        'Stage': 'Stage',
        'EmEspera': 'Em Espera',
        'Dock': 'Doca',
        'Equipment': 'Equipamento',
        // Countries
        'Brazil': 'Brasil',
        // Errors
        'Unexpected error': 'Ocorreu um erro não esperado',
        'Unauthorized error user': 'Ação não autorizada para seu usuário.',
        // Receipt
        'Stage Receipt': 'Recebimento em Stage',
        // Process Types
        'Receipt': 'Recebimento',
        // Replenishment
        'Replenishment': 'Reabastecimento',
        //InventoryControl
        'InventoryControl': 'Controle de Inventário',
        //PutAway
        'PutAway': 'Armazenagem',
        //Picking
        'Picking': 'Separação',
        //QualityControl
        'QualityControl': 'Controle de Qualidade',
        // Reasons Types
        'ItemBlocked': 'Bloqueio',
        'ItemInspection': 'Inspeção',
        'ItemRelease': 'liberação',
        'ItemDiscard': 'Descarte',
        'ItemLock': 'Bloqueio',
        'ItemUnlock': 'Desbloqueio',
        'ItemNonCompliance': 'Não conformidade',
        'ItemNotFromPO': 'Item Fora da Ordem',
        'ItemExpired': 'Item Expirado',
        'ItemCancelled': 'Item Cancelado',
        'StockHolded' : 'Estoque Bloqueado',
        'ItemDamaged': 'Item Danificado',
        'ItemReceivedMoreThanPO': 'Item recebido com valor a mais',
        'ItemReceivedlessThanPO': 'Item recebido com valor a menos',
        'Move': 'Movimentação',
        'Orderdiscrepancy': 'Discrepância da Ordem',
        'ItemStockAdjust': 'Ajuste de Estoque',
        'ExitReason': 'Saída do Sistema',
        'Open': 'Aberto',
        'Executing': 'Executando',
        'Cancelled': 'Cancelado',
        'Finished': 'Finalizado',
        'Closed': 'Fechado'        ,
        'Hold': 'Bloqueado',
        'Innactive': 'Inativo',
        'Blocked': 'Bloqueado',
        'Available': 'Disponível',
        'Damaged': 'Danificado',
        'quality.Holding': 'Bloq./Desbloq. ',
        'receipt.StageReceipt': 'Receb. stage (Menu)',
        'quality.Inspection': 'Inspeção',
        'inventory.Scrap': 'Desc. de invent.',
        'inventory.Adjust': 'Ajuste de invent.',
        'inventory.View': 'Consulta de invent.',
        'process.Messages': 'Mensagens',
        'Log-in.Log-out': 'Entrada/Saída Sistema',
        'receipt.StageReceiptIN': 'Receb. Stage',
        'LPN': 'Lpn',
        'FecharCargaFabrica': 'Fechar Carga Fábrica',
        'None': 'Indiferente',
        'Item': 'Item',
        'New': 'Novo',
        'Picked': 'Separado',
        'Released': 'Liberado',
        'Completed': 'Completo',
        'Completa': 'Completa',
        'Confered': 'Conferido',
        'Unassigned': 'Não Associado',
        'NaoAssociada': 'Não Associada',
        'Assigned': 'Associado',
        'Hold': 'Bloqueado',
        'Holded': 'Bloqueado',
        'ParcialCompleted': 'Parcial',
        'Execution': 'Em Execução',
        'True': 'Verdadeiro',
        'False': 'Falso',
        'Allocated': 'Alocado',
        'Loaded': 'Carregado',
        'Loading': 'Carregando',
        'InDisplacement': 'Em deslocamento',
        'PartiallyLoaded': 'Parcialmente Carregado',
        'Pick' : 'Separação',
        'Maneuver': 'Manobrista',
        'BlitzLoading': 'Blitz de Carregamento',
        'BulkPick': 'Separação Palete Fechado',
        'Conference': 'Conferência',
        'Replenishment' : 'Reabastecimento',
        'Load': 'Carregamento',
        'Move': 'Movimentação',
        'DocumentStoring': 'Armazenagem (Mapa)',
        'VehicleStoring': 'Armazenagem (Veículo)',
        'LocationStoring': 'Armazenagem (Endereço)',
        'Receipt_RotateCheck': 'Giro 360 Puxada',
        'ReceiptUnload': 'Descarregamento Puxada',
        'Expedition': 'Expedição',
        'Cancellation': 'Cancelamento',
        'Receipt_Conference': 'Conferência de Recebimento',
        'ReversePicking': 'Estorno de separação',
        'Canceled': 'Cancelado',
        'Partial': 'Parcial',
        'Empty': 'Vazio',
        'Full': 'Cheio',
        'Blocked': 'Bloqueado',
        'Load_Close': 'Fechar Carregamento',
        'Transition': 'Em Transição',
        'UnReleaseLoad': 'Desfazer Liberação',
        'Integrations': 'Integração',
        'PalletMountingIndicator': 'Qualidade de Montagem de Palete',
        'AdjustStock': 'Ajuste de Estoque',
        'Stopped': 'Parado',
        'Producing': 'Produzindo',
        'Paused': 'Pausado',
        'Block': 'Bloquear',
        'Cancel': 'Cancelar',
        'Unblock': 'Desbloquear',
        'Unassoc': 'Desassociar',
        'BlockTask': 'Deseja bloquear esta tarefa?',
        'UnblockTask': 'Deseja desbloquear esta tarefa?',
        'CancelTask': 'Deseja cancelar esta tarefa?',
        'UnassocTask': 'Deseja desassociar esta tarefa?',
        'AbastecimentoLinhaFabrica': 'Abastecimento de Linha',
        //'br.com.hbsis.wms.ambev.picking.process.PickingProcess': 'Acessou o Aplicativo Separação',
        //'br.com.hbsis.wms.ambev.process.DesktopProcess': 'Acessou Menu',
        //'br.com.hbsis.wms.ambev.view_hold_release.process.ViewProcess': 'Acessou o Aplicativo Consulta de Estoque',
        //'br.com.hbsis.wms.ambev.loading.process.LoadingProcess': 'Acessou o Aplicativo Carregamento',
        //'br.com.hbsis.wms.ambev.physicalAdjust.process.PhysicalProcess': 'Acessou o Aplicativo Ajuste Físico',
        //'br.com.hbsis.wms.ambev.replenishment.process.ReplenishmentProcess': 'Acessou o Aplicativo Reabastecimento',
        //'br.com.hbsis.wms.ambev.replenishment.proactive.process.SupplyProcess': 'Acessou o Aplicativo Gerar Rebastecimento',
        //'br.com.hbsis.wms.ambev.adjust.process.AdjustProcess': 'Acessou o Aplicativo Ajuste de Estoque',
        //'br.com.hbsis.wms.ambev.receipt.pull.turn360.process.Turn360Process': 'Acessou o Aplicativo Giro 360',
        //'br.com.hbsis.wms.ambev.picking.bulk.process.BulkPickingProcess': 'Acessou o Aplicativo Carregamento Palete Fechado',
        
        //TEMPORARIO - Descontinuado
        '83BEF213-D92B-40AD-B1BE-A49301207164': 'Pulmão Mono',
        '12C058E8-1C83-44CA-A829-6C16BFD2B8F3': 'Pulmão Multi',
        'A12058E8-1C83-44CA-A829-6C16BFD2B8F3': 'Veículo',
        'B4798A1B-7B91-4B47-B871-A3340124FBDE': 'Qualidade',
        'C1228A1B-7B91-4B47-B871-A3340124FBDE': 'Quarentena',
        'DE138A1B-7B91-4B47-B871-A3340124FBDE': 'Pátio',
        '1FD48A1B-7B91-4B47-B871-A3340124FBDE': 'Remontagem',
        '3CE58A1B-7B91-4B47-B871-A3340124FBDE': 'Conferência',
        'C3AA6A1B-7B91-4B47-B871-A3340124FBDE': 'Devolução',
        'F1178A1B-7B91-4B47-B871-A3340124FBDE': 'Serviço de Valor Agregado',
        'ADF98A1B-7B91-4B47-B871-A3340124FBDE': 'Perigosos',
        'C0318A1B-7B91-4B47-B871-A3340124FBDE': 'Corredor',
        '32E28A1B-7B91-4B47-B871-A3340124FBDE': 'Ativos',
        'CA248A1B-7B91-4B47-B871-A3340124FBDE': 'Stage de Produção',
        '22C58A1B-7B91-4B47-B871-A3340124FBDE': 'Linha de Produção',
        'FF168A1B-7B91-4B47-B871-A3340124FBDE': 'Descarte',
        '668AB1DD-7546-4682-8196-1EB1EB1D90BE': 'Stage RotaContagem',
        'B12C7318-6C78-4191-9FA9-215428968D63': 'Doca RotaContagem',
        '648AB1DD-7546-4682-8196-1EB1EB1D90BE': 'Stage Puxada',
        'B10E7318-6C78-4191-9FA9-215428968D63': 'Doca Puxada',
        '658EB1DD-7546-4682-8196-1EB1EB1D90BE': 'Stage Carregamento',
        'B11F7318-6C78-4191-9FA9-215428968D63': 'Doca Carregamento',
        'ECC058E8-1C83-44CA-A829-6C16BFD2B9E1': 'Pit Stop',
        'A3A365B4-1ABF-4811-AC79-3410CE2B39F3': 'Equipamento',
        'E8D5681B-5C95-4265-97FA-A4910100AB66': 'Separação',
        '33A88A1B-7B91-4B47-B871-A3340124FBDE': 'Cross-Docking',
        '1A238A1B-7B91-4B47-B871-A3340124FBDE': 'KIT',
        '3EA86659-1BD3-40E0-AB8E-FD037ED451C6': 'Área Estorno/Junção',
        '7BD28772-8A1E-4B65-B000-DCA094F18165': 'Stage Remontagem',
        'B5FF3EA5-8622-4B47-89B1-B3A00AE6D207': 'Reembalagem',
        '04C06515-1947-4EC7-9461-1479E2CCA7D8': 'Refugo',

        //VER ESSE PROBLEMA: NAO DEVERIA ESTAR COLOCANDO O HASHCODE DO ENUM AQUI.
        '2': 'Bloqueado',
        '0': 'Disponível',
        '1': 'Danificado',

        //Tipos de Endereç
        'BFO': 'Pulmão Mono',
        'BFI': 'Pulmão Multi',
        'VEH': 'Veículo',
        'QLT': 'Qualidade',
        'QRT': 'Quarentena',
        'YRD': 'Pátio',
        'RSB': 'Remontagem',
        'CHK': 'Conferência',
        'RTN': 'Devolução',
        'VAS': 'Serviço de Valor Agregado',
        'HAZ': 'Perigosos',
        'AIS': 'Corredor',
        'AST': 'Ativos',
        'STGP': 'Stage de Produção',
        'PRD': 'Linha de Produção',
        'SCP': 'Descarte',
        'STGO': 'Stage RotaContagem',
        'DOCO': 'Doca RotaContagem',
        'STGR': 'Stage Puxada',
        'DOCR': 'Doca Puxada',
        'STGL': 'Stage Carregamento',
        'DOCL': 'Doca Carregamento',
        'PIT': 'Pit Stop',
        'EQP': 'Equipamento',
        'EQPD': 'Equipamento de 2 garfos',
        'PIC': 'Separação',
        'XDK': 'Cross-Docking',
        'KIT': 'KIT',
        'RVS': 'Área Estorno/Junção',
        'SRSB': 'Stage Remontagem',
        'RPK': 'Reembalagem',
        'RFS': 'Refugo',

        // não remover até achar uma solução para buscar resources do js 
        'SuccessReplenishment': 'Gerada tarefa de reabastecimento',
        'ErrorReplenishment': 'Problema ocorrido na tarefa de reabastecimento.',
        'Loaded': 'Carregado',
        'Shipped': 'Expedido',
        'AdjustPhysical': 'Ajuste Físico',
        'StockRevision': 'Revisão de estoque',
        'RouteReturnUnload': 'Descar. Retorno de RotaContagem',
        'ReceiptRotateCheck': 'Puxada Giro 360',
        'ReceiptConference': 'Puxada Conferência',
        'ReceiptUnLoad': 'Puxada Descarr.',
        'AssociateTask': 'Associação da Tarefa',
        'DisassociateTask': 'Desassociação da Tarefa',
        'FinalizeTask': 'Finalização da Tarefa',
        'ManualTask': 'Tarefa Manual',        
        'LoadClose': 'Fechamento de Carga',
        'Stock_Revision': 'Revisão de Estoque',
        'CarregamentoPaleteFechadoFabrica': 'Carregamento Palete Fechado',
        'FechamentoDT': 'Fechamento de Documento de Transporte',
        'CarregamentoBoxFabrica' : 'Carregamento Box Fábrica',
        'Contagem': 'Contagem',
        'ColetaDataValidade': 'Coleta data de Validade',
        'Diaria': 'Diária',
        'ContagemEstoque': 'Contagem de Estoque',
        'EntradaPortaria': 'Portaria - Entrada',
        'ConferenciaRecebimentoProdutoAcabado': 'Conferência Recebimento PA',
        'ConferenciaOrdemDescarga': 'Conferência Recebimento',
        'BlitzRefugo': 'Blitz de Refugo',
        'ConferidoComDivergencia': 'Conferido com divergência',
        'ConferidoComDataDivergente': 'Conferido com data divergente',
        'ConcluidaDivergente': 'Conferido com divergência',
        'Criada': 'Criada',
        'Associada': 'Associada',
        'Desassociada': 'Desassociada',
        'Carregada': 'Carregada',
        'Finalizada': 'Finalizada',
        'Cancelada': 'Cancelada',
        'Concluida': 'Completa',
        'ImportacaoDocumento': 'Importação do Documento',
        'LiberacaoDocumento': 'Liberação do Documento',
        'TarefaLiberada': 'Liberada',
        'BlitzImportada': 'Blitz Importada',
        'BuscarEndereco': 'Buscar Endereço',
        'EnderecoCheio': 'Endereço Cheio',
        'Superlotar': 'Superlotar Endereço',
        'Apontado': 'Apontamento',
        'SalvarItemBaia': 'Registrado Item para a Baia',
        'FinalizarComCancelamentoCarga': 'Tarefa Finalizada com Cancelamento de Carga',
        'FinalizarComDiferencas': 'Tarefa Finalizada com Diferenças',
        'OrdemDescargaBaiaConferida': 'Ordem de Descarga Baia Conferida',
        'ConferenciaItem': 'Conferência de Item',
        'NaoCalculado': 'Não Calculado',

        //processos
        "loading": "Carregamento de palete misto",
        "loading.bulk": "Carregamento de palete fechado",
        "receipt.pull.checkout": "Conferência da puxada",

        "CancelamentoMapa": "Cancelamento de Mapas"
    },
    get: function (key) {
        return this.dictionary[key] ? this.dictionary[key] : key;
    }

};

moment.lang('pt-br', {
    months: "janeiro_fevereiro_março_abril_maio_junho_julho_agosto_setembro_outubro_novembro_dezembro".split("_"),
    monthsShort: "jan_fev_mar_abr_mai_jun_jul_ago_set_out_nov_dez".split("_"),
    weekdays: "domingo_segunda-feira_terça-feira_quarta-feira_quinta-feira_sexta-feira_sábado".split("_"),
    weekdaysShort: "dom_seg_ter_qua_qui_sex_sáb".split("_"),
    weekdaysMin: "dom_2ª_3ª_4ª_5ª_6ª_sáb".split("_"),
    longDateFormat: {
        LT: "HH:mm",
        L: "DD/MM/YYYY",
        LL: "D [de] MMMM [de] YYYY",
        LLL: "D [de] MMMM [de] YYYY [às] LT",
        LLLL: "dddd, D [de] MMMM [de] YYYY [às] LT"
    },
    calendar: {
        sameDay: '[Hoje às] LT',
        nextDay: '[Amanhã às] LT',
        nextWeek: 'dddd [às] LT',
        lastDay: '[Ontem às] LT',
        lastWeek: function () {
            return (this.day() === 0 || this.day() === 6) ?
                '[Último] dddd [às] LT' : // Saturday + Sunday
                '[Última] dddd [às] LT'; // Monday - Friday
        },
        sameElse: 'L'
    },
    relativeTime: {
        future: "em %s",
        past: "%s atrás",
        s: "segundos",
        m: "um minuto",
        mm: "%d minutos",
        h: "uma hora",
        hh: "%d horas",
        d: "um dia",
        dd: "%d dias",
        M: "um mês",
        MM: "%d meses",
        y: "um ano",

        yy: "%d anos"
    },
    ordinal: '%dº'
});

//moment.lang('pt-br');
