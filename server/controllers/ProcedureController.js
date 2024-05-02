class ProcedureController {
  async getAll (req, res) {
    try {
      const procedures = await req.app.services.procedures.getAll()
      res.json(procedures)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
    
  async addProcedure (req, res) {
    try {
      const newProcedure = await req.app.services.procedures.addProcedure(req.files)
      res.json(newProcedure)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }  

  async getUniqueProcedure (req, res) {
    try {
      const { id } = req.query
      const procedure = await req.app.services.procedures.getUniqueProcedure(id)
      res.json(procedure)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  } 

  async editProcedure (req, res) {
    try {
      const { id } = req.params
      const editedProcedure = await req.app.services.procedures.editProcedure(id, req.files)
      res.json(editedProcedure)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }  

  async deleteProcedure (req, res) {
    try {
      const { id } = req.params
      const deletedProcedure = await req.app.services.procedures.deleteProcedure(id)
      res.json(deletedProcedure)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
}

module.exports = ProcedureController