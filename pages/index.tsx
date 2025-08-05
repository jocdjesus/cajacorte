"use client"

import { useState } from "react"
import { Plus, Minus, Calculator, FileText, Trash2 } from "lucide-react"

interface Venta {
  id: string
  concepto: string
  monto: number
  hora: string
}

interface Gasto {
  id: string
  concepto: string
  monto: number
  hora: string
}

interface ConteoEfectivo {
  billetes1000: number
  billetes500: number
  billetes200: number
  billetes100: number
  billetes50: number
  billetes20: number
  monedas10: number
  monedas5: number
  monedas2: number
  monedas1: number
}

export default function CorteCajaApp() {
  const [ventas, setVentas] = useState<Venta[]>([])
  const [gastos, setGastos] = useState<Gasto[]>([])
  const [fondoInicial, setFondoInicial] = useState<number>(0)
  const [conteoEfectivo, setConteoEfectivo] = useState<ConteoEfectivo>({
    billetes1000: 0,
    billetes500: 0,
    billetes200: 0,
    billetes100: 0,
    billetes50: 0,
    billetes20: 0,
    monedas10: 0,
    monedas5: 0,
    monedas2: 0,
    monedas1: 0,
  })

  const [nuevaVenta, setNuevaVenta] = useState({ concepto: "", monto: "" })
  const [nuevoGasto, setNuevoGasto] = useState({ concepto: "", monto: "" })

  const agregarVenta = () => {
    if (nuevaVenta.concepto && nuevaVenta.monto) {
      const venta: Venta = {
        id: Date.now().toString(),
        concepto: nuevaVenta.concepto,
        monto: Number.parseFloat(nuevaVenta.monto),
        hora: new Date().toLocaleTimeString(),
      }
      setVentas([...ventas, venta])
      setNuevaVenta({ concepto: "", monto: "" })
    }
  }

  const agregarGasto = () => {
    if (nuevoGasto.concepto && nuevoGasto.monto) {
      const gasto: Gasto = {
        id: Date.now().toString(),
        concepto: nuevoGasto.concepto,
        monto: Number.parseFloat(nuevoGasto.monto),
        hora: new Date().toLocaleTimeString(),
      }
      setGastos([...gastos, gasto])
      setNuevoGasto({ concepto: "", monto: "" })
    }
  }

  const eliminarVenta = (id: string) => {
    setVentas(ventas.filter((v) => v.id !== id))
  }

  const eliminarGasto = (id: string) => {
    setGastos(gastos.filter((g) => g.id !== id))
  }

  const totalVentas = ventas.reduce((sum, venta) => sum + venta.monto, 0)
  const totalGastos = gastos.reduce((sum, gasto) => sum + gasto.monto, 0)

  const totalEfectivoContado =
    conteoEfectivo.billetes1000 * 1000 +
    conteoEfectivo.billetes500 * 500 +
    conteoEfectivo.billetes200 * 200 +
    conteoEfectivo.billetes100 * 100 +
    conteoEfectivo.billetes50 * 50 +
    conteoEfectivo.billetes20 * 20 +
    conteoEfectivo.monedas10 * 10 +
    conteoEfectivo.monedas5 * 5 +
    conteoEfectivo.monedas2 * 2 +
    conteoEfectivo.monedas1 * 1

  const efectivoEsperado = fondoInicial + totalVentas - totalGastos
  const diferencia = totalEfectivoContado - efectivoEsperado

  const actualizarConteo = (denominacion: keyof ConteoEfectivo, valor: number) => {
    setConteoEfectivo((prev) => ({
      ...prev,
      [denominacion]: Math.max(0, valor),
    }))
  }

  return (
    <div className="corte-caja-app">
      <div className="container">
        {/* Header */}
        <div className="header-card">
          <div className="header-icon-container">
            <Calculator className="header-icon" />
          </div>
          <h1 className="header-title">Corte de Caja</h1>
          <p className="header-date">
            {new Date().toLocaleDateString("es-ES", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Fondo Inicial y Resumen */}
        <div className="layout-grid-1-3">
          {/* Fondo Inicial */}
          <div className="card card-green">
            <div className="card-header">
              <h2 className="card-title card-title-green">
                <div className="icon-badge icon-badge-green">
                  <Calculator className="icon-green" />
                </div>
                Fondo Inicial
              </h2>
            </div>
            <div className="card-content">
              <div className="input-group">
                <label htmlFor="fondo" className="input-label">Monto inicial en caja</label>
                <div className="input-wrapper">
                  <span className="input-prefix">$</span>
                  <input
                    id="fondo"
                    type="number"
                    placeholder="0.00"
                    className="input input-lg input-green"
                    value={fondoInicial || ""}
                    onChange={(e) => setFondoInicial(Number.parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Resumen del Día */}
          <div className="card card-blue-summary">
            <div className="card-header">
              <h2 className="card-title card-title-blue">
                <div className="icon-badge icon-badge-blue">
                  <FileText className="icon-blue" />
                </div>
                Resumen del Día
              </h2>
            </div>
            <div className="card-content">
              <div className="layout-grid-2">
                <div className="summary-section">
                  <div className="summary-item summary-item-white">
                    <span className="summary-label">Fondo inicial:</span>
                    <span className="summary-value">${fondoInicial.toFixed(2)}</span>
                  </div>
                  <div className="summary-item summary-item-green">
                    <span className="summary-label">Total ventas:</span>
                    <span className="summary-value">+${totalVentas.toFixed(2)}</span>
                  </div>
                  <div className="summary-item summary-item-red">
                    <span className="summary-label">Total gastos:</span>
                    <span className="summary-value">-${totalGastos.toFixed(2)}</span>
                  </div>
                </div>
                <div className="summary-final-section">
                  <div className="summary-final-card">
                    <div className="summary-final-item">
                      <span className="summary-label-final">Efectivo esperado:</span>
                      <span className="summary-value-final">${efectivoEsperado.toFixed(2)}</span>
                    </div>
                    <div className="summary-final-item">
                      <span className="summary-label-final">Efectivo contado:</span>
                      <span className="summary-value-final">${totalEfectivoContado.toFixed(2)}</span>
                    </div>
                    <hr className="divider-blue" />
                    <div
                      className={`summary-final-difference ${
                        diferencia >= 0 ? "difference-positive" : "difference-negative"
                      }`}
                    >
                      <span className="summary-label-final-diff">Diferencia:</span>
                      <span className="summary-value-final-diff">
                        {diferencia >= 0 ? "+" : ""}${diferencia.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ventas y Gastos */}
        <div className="layout-grid-2">
          {/* Ventas */}
          <div className="card card-green-sales">
            <div className="card-header">
              <h2 className="card-title card-title-green">
                <div className="icon-badge icon-badge-green">
                  <Plus className="icon-green" />
                </div>
                Ventas del Día
              </h2>
              <p className="card-description card-description-green">Registra todas las ventas realizadas</p>
            </div>
            <div className="card-content">
              <div className="input-action-group">
                <input
                  placeholder="Descripción de la venta"
                  className="input input-action input-green"
                  value={nuevaVenta.concepto}
                  onChange={(e) => setNuevaVenta((prev) => ({ ...prev, concepto: e.target.value }))}
                />
                <div className="input-and-button">
                  <div className="input-wrapper input-wrapper-flex">
                    <span className="input-prefix">$</span>
                    <input
                      type="number"
                      placeholder="0.00"
                      className="input input-action input-green input-padded"
                      value={nuevaVenta.monto}
                      onChange={(e) => setNuevaVenta((prev) => ({ ...prev, monto: e.target.value }))}
                    />
                  </div>
                  <button
                    onClick={agregarVenta}
                    className="button button-add-sale"
                  >
                    <Plus className="button-icon" />
                    Agregar
                  </button>
                </div>
              </div>

              <div className="list-container">
                {ventas.map((venta) => (
                  <div
                    key={venta.id}
                    className="list-item list-item-green"
                  >
                    <div className="list-item-content">
                      <p className="list-item-title">{venta.concepto}</p>
                      <p className="list-item-time">{venta.hora}</p>
                    </div>
                    <div className="list-item-actions">
                      <div className="badge badge-green">
                        ${venta.monto.toFixed(2)}
                      </div>
                      <button
                        onClick={() => eliminarVenta(venta.id)}
                        className="button-icon-only button-icon-red"
                      >
                        <Trash2 className="icon-sm" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="total-section total-section-green">
                <div className="total-card total-card-green">
                  <span className="total-label">Total Ventas:</span>
                  <span className="total-value">${totalVentas.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Gastos */}
          <div className="card card-red-expenses">
            <div className="card-header">
              <h2 className="card-title card-title-red">
                <div className="icon-badge icon-badge-red">
                  <Minus className="icon-red" />
                </div>
                Gastos del Día
              </h2>
              <p className="card-description card-description-red">Registra todos los gastos realizados</p>
            </div>
            <div className="card-content">
              <div className="input-action-group">
                <input
                  placeholder="Descripción del gasto"
                  className="input input-action input-red"
                  value={nuevoGasto.concepto}
                  onChange={(e) => setNuevoGasto((prev) => ({ ...prev, concepto: e.target.value }))}
                />
                <div className="input-and-button">
                  <div className="input-wrapper input-wrapper-flex">
                    <span className="input-prefix">$</span>
                    <input
                      type="number"
                      placeholder="0.00"
                      className="input input-action input-red input-padded"
                      value={nuevoGasto.monto}
                      onChange={(e) => setNuevoGasto((prev) => ({ ...prev, monto: e.target.value }))}
                    />
                  </div>
                  <button
                    onClick={agregarGasto}
                    className="button button-add-expense"
                  >
                    <Plus className="button-icon" />
                    Agregar
                  </button>
                </div>
              </div>

              <div className="list-container">
                {gastos.map((gasto) => (
                  <div
                    key={gasto.id}
                    className="list-item list-item-red"
                  >
                    <div className="list-item-content">
                      <p className="list-item-title">{gasto.concepto}</p>
                      <p className="list-item-time">{gasto.hora}</p>
                    </div>
                    <div className="list-item-actions">
                      <div className="badge badge-red">
                        ${gasto.monto.toFixed(2)}
                      </div>
                      <button
                        onClick={() => eliminarGasto(gasto.id)}
                        className="button-icon-only button-icon-red"
                      >
                        <Trash2 className="icon-sm" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="total-section total-section-red">
                <div className="total-card total-card-red">
                  <span className="total-label">Total Gastos:</span>
                  <span className="total-value">${totalGastos.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Conteo de Efectivo */}
        <div className="card card-purple-count">
          <div className="card-header">
            <h2 className="card-title card-title-purple">
              <div className="icon-badge icon-badge-purple">
                <Calculator className="icon-purple" />
              </div>
              <div className="card-title-text-container">
                <h3 className="card-title-lg">Conteo de Efectivo</h3>
                <p className="card-description card-description-purple">Cuenta el dinero físico en la caja</p>
              </div>
            </h2>
          </div>
          <div className="card-content">
            <div className="layout-grid-3">
              {/* Billetes */}
              <div className="count-section">
                <div className="count-card">
                  <h4 className="count-title">
                    <div className="dot dot-green"></div>
                    Billetes
                  </h4>
                  <div className="count-list">
                    {[
                      { label: "$1,000", key: "billetes1000" as keyof ConteoEfectivo, value: 1000, color: "purple" },
                      { label: "$500", key: "billetes500" as keyof ConteoEfectivo, value: 500, color: "blue" },
                      { label: "$200", key: "billetes200" as keyof ConteoEfectivo, value: 200, color: "green" },
                      { label: "$100", key: "billetes100" as keyof ConteoEfectivo, value: 100, color: "yellow" },
                      { label: "$50", key: "billetes50" as keyof ConteoEfectivo, value: 50, color: "orange" },
                      { label: "$20", key: "billetes20" as keyof ConteoEfectivo, value: 20, color: "red" },
                    ].map(({ label, key, value, color }) => (
                      <div key={key} className={`count-item count-item-${color}`}>
                        <div className="count-item-header">
                          <label className="count-item-label">{label}</label>
                          <span className="count-item-value">
                            ${(conteoEfectivo[key] * value).toLocaleString()}
                          </span>
                        </div>
                        <input
                          type="number"
                          min="0"
                          className="input-count"
                          value={conteoEfectivo[key] || ""}
                          onChange={(e) => actualizarConteo(key, Number.parseInt(e.target.value) || 0)}
                          placeholder="0"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Monedas */}
              <div className="count-section">
                <div className="count-card">
                  <h4 className="count-title">
                    <div className="dot dot-yellow"></div>
                    Monedas
                  </h4>
                  <div className="count-list">
                    {[
                      { label: "$10", key: "monedas10" as keyof ConteoEfectivo, value: 10, color: "gray" },
                      { label: "$5", key: "monedas5" as keyof ConteoEfectivo, value: 5, color: "gray" },
                      { label: "$2", key: "monedas2" as keyof ConteoEfectivo, value: 2, color: "gray" },
                      { label: "$1", key: "monedas1" as keyof ConteoEfectivo, value: 1, color: "gray" },
                    ].map(({ label, key, value, color }) => (
                      <div key={key} className={`count-item count-item-${color}`}>
                        <div className="count-item-header">
                          <label className="count-item-label">{label}</label>
                          <span className="count-item-value">
                            ${(conteoEfectivo[key] * value).toLocaleString()}
                          </span>
                        </div>
                        <input
                          type="number"
                          min="0"
                          className="input-count"
                          value={conteoEfectivo[key] || ""}
                          onChange={(e) => actualizarConteo(key, Number.parseInt(e.target.value) || 0)}
                          placeholder="0"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Total Final */}
              <div className="count-section">
                <div className="total-final-card">
                  <div className="total-final-header">
                    <div className="total-final-icon-container">
                      <Calculator className="total-final-icon" />
                    </div>
                    <h4 className="total-final-title">Total Efectivo</h4>
                    <div className="total-final-amount">${totalEfectivoContado.toLocaleString()}</div>
                  </div>
                  <div className="total-final-summary">
                    <div className="total-final-summary-item">
                      <div className="total-final-summary-item-content">
                        <span className="total-final-label">Esperado:</span>
                        <span className="total-final-value">${efectivoEsperado.toLocaleString()}</span>
                      </div>
                    </div>
                    <div
                      className={`total-final-summary-item-diff ${
                        diferencia >= 0 ? "diff-positive" : "diff-negative"
                      }`}
                    >
                      <div className="total-final-summary-item-content">
                        <span className="total-final-label">
                          {diferencia >= 0 ? "Sobrante:" : "Faltante:"}
                        </span>
                        <span className="total-final-value-diff">${Math.abs(diferencia).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}